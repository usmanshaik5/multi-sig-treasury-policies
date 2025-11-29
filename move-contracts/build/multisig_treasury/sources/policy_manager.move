module multisig_treasury::policy_manager {
    use sui::table::{Self, Table};
    use sui::event;

    // =================== Error Codes ===================
    const EPolicyViolation: u64 = 1;
    const EInvalidPolicy: u64 = 2;
    const EUnauthorized: u64 = 3;

    // =================== Constants ===================
    const PERIOD_DAILY: u8 = 0;
    const PERIOD_WEEKLY: u8 = 1;
    const PERIOD_MONTHLY: u8 = 2;

    // =================== Structs ===================
    
    /// Policy configuration for a treasury
    public struct PolicyConfig has key, store {
        id: UID,
        treasury_id: ID,
        
        // Spending limits per category
        daily_limits: Table<vector<u8>, u64>,
        weekly_limits: Table<vector<u8>, u64>,
        monthly_limits: Table<vector<u8>, u64>,
        
        // Global limits
        global_daily_limit: u64,
        global_weekly_limit: u64,
        global_monthly_limit: u64,
        
        // Per-transaction caps
        max_single_transaction: u64,
        
        // Whitelist/Blacklist
        whitelisted_recipients: Table<address, u64>, // address => expiration timestamp
        blacklisted_recipients: Table<address, bool>,
        
        // Time-lock policies
        base_time_lock: u64, // base time-lock in ms
        time_lock_factor: u64, // factor for amount-based increase
        
        // Amount thresholds for escalation
        threshold_tiers: vector<ThresholdTier>,
        
        // Tracking
        daily_spending: Table<vector<u8>, u64>,
        weekly_spending: Table<vector<u8>, u64>,
        monthly_spending: Table<vector<u8>, u64>,
        global_daily_spending: u64,
        global_weekly_spending: u64,
        global_monthly_spending: u64,
        
        // Period reset timestamps
        last_daily_reset: u64,
        last_weekly_reset: u64,
        last_monthly_reset: u64,
    }

    public struct ThresholdTier has store, copy, drop {
        max_amount: u64,
        required_signatures: u8,
    }

    // =================== Events ===================
    
    public struct PolicyConfigCreated has copy, drop {
        config_id: ID,
        treasury_id: ID,
        timestamp: u64,
    }

    public struct SpendingLimitSet has copy, drop {
        config_id: ID,
        category: vector<u8>,
        period: u8,
        limit: u64,
        timestamp: u64,
    }

    public struct PolicyViolation has copy, drop {
        config_id: ID,
        violation_type: vector<u8>,
        details: vector<u8>,
        timestamp: u64,
    }

    public struct WhitelistUpdated has copy, drop {
        config_id: ID,
        recipient: address,
        expiration: u64,
        timestamp: u64,
    }

    // =================== Public Functions ===================
    
    /// Create policy configuration for a treasury
    public entry fun create_policy_config(
        treasury_id: ID,
        global_daily_limit: u64,
        global_weekly_limit: u64,
        global_monthly_limit: u64,
        max_single_transaction: u64,
        base_time_lock: u64,
        time_lock_factor: u64,
        ctx: &mut TxContext
    ) {
        let config_uid = object::new(ctx);
        let config_id = config_uid.to_inner();
        let current_time = ctx.epoch_timestamp_ms();

        let policy_config = PolicyConfig {
            id: config_uid,
            treasury_id,
            daily_limits: table::new(ctx),
            weekly_limits: table::new(ctx),
            monthly_limits: table::new(ctx),
            global_daily_limit,
            global_weekly_limit,
            global_monthly_limit,
            max_single_transaction,
            whitelisted_recipients: table::new(ctx),
            blacklisted_recipients: table::new(ctx),
            base_time_lock,
            time_lock_factor,
            threshold_tiers: vector::empty(),
            daily_spending: table::new(ctx),
            weekly_spending: table::new(ctx),
            monthly_spending: table::new(ctx),
            global_daily_spending: 0,
            global_weekly_spending: 0,
            global_monthly_spending: 0,
            last_daily_reset: current_time,
            last_weekly_reset: current_time,
            last_monthly_reset: current_time,
        };

        event::emit(PolicyConfigCreated {
            config_id,
            treasury_id,
            timestamp: current_time,
        });

        transfer::share_object(policy_config);
    }

    /// Set spending limit for a category
    public entry fun set_category_limit(
        config: &mut PolicyConfig,
        category: vector<u8>,
        period: u8,
        limit: u64,
        ctx: &mut TxContext
    ) {
        assert!(period <= PERIOD_MONTHLY, EInvalidPolicy);

        if (period == PERIOD_DAILY) {
            if (config.daily_limits.contains(category)) {
                let limit_ref = config.daily_limits.borrow_mut(category);
                *limit_ref = limit;
            } else {
                config.daily_limits.add(category, limit);
            };
        } else if (period == PERIOD_WEEKLY) {
            if (config.weekly_limits.contains(category)) {
                let limit_ref = config.weekly_limits.borrow_mut(category);
                *limit_ref = limit;
            } else {
                config.weekly_limits.add(category, limit);
            };
        } else {
            if (config.monthly_limits.contains(category)) {
                let limit_ref = config.monthly_limits.borrow_mut(category);
                *limit_ref = limit;
            } else {
                config.monthly_limits.add(category, limit);
            };
        };

        event::emit(SpendingLimitSet {
            config_id: object::id(config),
            category,
            period,
            limit,
            timestamp: ctx.epoch_timestamp_ms(),
        });
    }

    /// Add address to whitelist
    public entry fun add_to_whitelist(
        config: &mut PolicyConfig,
        recipient: address,
        expiration: u64,
        ctx: &mut TxContext
    ) {
        if (config.whitelisted_recipients.contains(recipient)) {
            let exp_ref = config.whitelisted_recipients.borrow_mut(recipient);
            *exp_ref = expiration;
        } else {
            config.whitelisted_recipients.add(recipient, expiration);
        };

        event::emit(WhitelistUpdated {
            config_id: object::id(config),
            recipient,
            expiration,
            timestamp: ctx.epoch_timestamp_ms(),
        });
    }

    /// Add address to blacklist
    public entry fun add_to_blacklist(
        config: &mut PolicyConfig,
        recipient: address,
        _ctx: &mut TxContext
    ) {
        if (!config.blacklisted_recipients.contains(recipient)) {
            config.blacklisted_recipients.add(recipient, true);
        };
    }

    /// Validate a transaction against all policies
    public fun validate_transaction(
        config: &mut PolicyConfig,
        recipient: address,
        amount: u64,
        category: vector<u8>,
        current_time: u64,
        ctx: &mut TxContext
    ): bool {
        // Reset periods if needed
        reset_periods_if_needed(config, current_time);

        // Check blacklist
        if (config.blacklisted_recipients.contains(recipient)) {
            event::emit(PolicyViolation {
                config_id: object::id(config),
                violation_type: b"BLACKLIST",
                details: b"Recipient is blacklisted",
                timestamp: current_time,
            });
            return false
        };

        // Check whitelist expiration (if whitelist is used)
        if (config.whitelisted_recipients.contains(recipient)) {
            let expiration = *config.whitelisted_recipients.borrow(recipient);
            if (expiration > 0 && current_time > expiration) {
                event::emit(PolicyViolation {
                    config_id: object::id(config),
                    violation_type: b"WHITELIST_EXPIRED",
                    details: b"Whitelist entry expired",
                    timestamp: current_time,
                });
                return false
            };
        };

        // Check single transaction max
        if (amount > config.max_single_transaction && config.max_single_transaction > 0) {
            event::emit(PolicyViolation {
                config_id: object::id(config),
                violation_type: b"MAX_TRANSACTION",
                details: b"Exceeds maximum single transaction",
                timestamp: current_time,
            });
            return false
        };

        // Check spending limits
        if (!check_spending_limits(config, category, amount, current_time, ctx)) {
            return false
        };

        true
    }

    /// Calculate required time-lock based on amount
    public fun calculate_time_lock(config: &PolicyConfig, amount: u64): u64 {
        if (config.time_lock_factor == 0) {
            return config.base_time_lock
        };
        
        let additional = amount / config.time_lock_factor;
        config.base_time_lock + additional
    }

    /// Get required signatures based on amount
    public fun get_required_signatures(config: &PolicyConfig, amount: u64, default_threshold: u8): u8 {
        let tiers = &config.threshold_tiers;
        let len = tiers.length();
        let mut i = 0;

        while (i < len) {
            let tier = tiers.borrow(i);
            if (amount <= tier.max_amount) {
                return tier.required_signatures
            };
            i = i + 1;
        };

        default_threshold
    }

    /// Add threshold tier
    public entry fun add_threshold_tier(
        config: &mut PolicyConfig,
        max_amount: u64,
        required_signatures: u8,
        _ctx: &mut TxContext
    ) {
        let tier = ThresholdTier {
            max_amount,
            required_signatures,
        };
        config.threshold_tiers.push_back(tier);
    }

    // =================== Helper Functions ===================
    
    fun reset_periods_if_needed(config: &mut PolicyConfig, current_time: u64) {
        let day_ms = 86400000; // 24 * 60 * 60 * 1000
        let week_ms = 604800000; // 7 * 24 * 60 * 60 * 1000
        let month_ms = 2592000000; // 30 * 24 * 60 * 60 * 1000

        // Reset daily
        if (current_time >= config.last_daily_reset + day_ms) {
            config.global_daily_spending = 0;
            config.last_daily_reset = current_time;
        };

        // Reset weekly
        if (current_time >= config.last_weekly_reset + week_ms) {
            config.global_weekly_spending = 0;
            config.last_weekly_reset = current_time;
        };

        // Reset monthly
        if (current_time >= config.last_monthly_reset + month_ms) {
            config.global_monthly_spending = 0;
            config.last_monthly_reset = current_time;
        };
    }

    fun check_spending_limits(
        config: &mut PolicyConfig,
        category: vector<u8>,
        amount: u64,
        current_time: u64,
        ctx: &mut TxContext
    ): bool {
        // Check global daily limit
        if (config.global_daily_limit > 0) {
            let new_daily = config.global_daily_spending + amount;
            if (new_daily > config.global_daily_limit) {
                event::emit(PolicyViolation {
                    config_id: object::id(config),
                    violation_type: b"DAILY_LIMIT",
                    details: b"Exceeds global daily limit",
                    timestamp: current_time,
                });
                return false
            };
        };

        // Check category daily limit
        if (config.daily_limits.contains(category)) {
            let daily_limit = *config.daily_limits.borrow(category);
            let current_spent = if (config.daily_spending.contains(category)) {
                *config.daily_spending.borrow(category)
            } else {
                0
            };
            
            if (current_spent + amount > daily_limit) {
                event::emit(PolicyViolation {
                    config_id: object::id(config),
                    violation_type: b"CATEGORY_DAILY_LIMIT",
                    details: b"Exceeds category daily limit",
                    timestamp: current_time,
                });
                return false
            };
        };

        true
    }

    // =================== View Functions ===================
    
    public fun get_global_daily_limit(config: &PolicyConfig): u64 {
        config.global_daily_limit
    }

    public fun get_global_daily_spending(config: &PolicyConfig): u64 {
        config.global_daily_spending
    }

    public fun is_whitelisted(config: &PolicyConfig, recipient: address, current_time: u64): bool {
        if (!config.whitelisted_recipients.contains(recipient)) {
            return false
        };
        
        let expiration = *config.whitelisted_recipients.borrow(recipient);
        expiration == 0 || current_time <= expiration
    }

    public fun is_blacklisted(config: &PolicyConfig, recipient: address): bool {
        config.blacklisted_recipients.contains(recipient)
    }
}
