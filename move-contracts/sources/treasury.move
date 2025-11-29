module multisig_treasury::treasury {
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::sui::SUI;
    use sui::table::{Self, Table};
    use sui::event;

    // =================== Error Codes ===================
    const EInvalidThreshold: u64 = 1;
    const EInvalidOwners: u64 = 2;
    const EInsufficientBalance: u64 = 3;
    const ETreasuryFrozen: u64 = 4;
    const EUnauthorized: u64 = 5;

    // =================== Structs ===================
    
    /// Main treasury holding funds and configuration
    public struct Treasury has key, store {
        id: UID,
        owners: vector<address>,
        threshold: u8,
        balance: Balance<SUI>,
        is_frozen: bool,
        total_deposited: u64,
        total_withdrawn: u64,
        spending_by_category: Table<vector<u8>, u64>, // category name => amount spent
        created_at: u64,
    }

    /// Capability for treasury administration
    public struct TreasuryAdminCap has key, store {
        id: UID,
        treasury_id: ID,
    }

    // =================== Events ===================
    
    public struct TreasuryCreated has copy, drop {
        treasury_id: ID,
        owners: vector<address>,
        threshold: u8,
        timestamp: u64,
    }

    public struct DepositMade has copy, drop {
        treasury_id: ID,
        amount: u64,
        depositor: address,
        timestamp: u64,
    }

    public struct WithdrawalExecuted has copy, drop {
        treasury_id: ID,
        amount: u64,
        recipient: address,
        category: vector<u8>,
        timestamp: u64,
    }

    public struct TreasuryFrozen has copy, drop {
        treasury_id: ID,
        timestamp: u64,
    }

    public struct TreasuryUnfrozen has copy, drop {
        treasury_id: ID,
        timestamp: u64,
    }

    // =================== Public Functions ===================
    
    /// Create a new treasury with specified owners and threshold
    public entry fun create_treasury(
        owners: vector<address>,
        threshold: u8,
        ctx: &mut TxContext
    ) {
        // Validate inputs
        let owner_count = owners.length();
        assert!(owner_count > 0, EInvalidOwners);
        assert!(threshold > 0 && (threshold as u64) <= owner_count, EInvalidThreshold);

        let treasury_uid = object::new(ctx);
        let treasury_id = treasury_uid.to_inner();

        let treasury = Treasury {
            id: treasury_uid,
            owners,
            threshold,
            balance: balance::zero<SUI>(),
            is_frozen: false,
            total_deposited: 0,
            total_withdrawn: 0,
            spending_by_category: table::new(ctx),
            created_at: ctx.epoch_timestamp_ms(),
        };

        // Create admin capability
        let admin_cap = TreasuryAdminCap {
            id: object::new(ctx),
            treasury_id,
        };

        // Emit event
        event::emit(TreasuryCreated {
            treasury_id,
            owners: treasury.owners,
            threshold: treasury.threshold,
            timestamp: ctx.epoch_timestamp_ms(),
        });

        // Transfer objects
        transfer::share_object(treasury);
        transfer::transfer(admin_cap, ctx.sender());
    }

    /// Deposit SUI coins into the treasury
    public entry fun deposit(
        treasury: &mut Treasury,
        coin: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let amount = coin.value();
        let depositor = ctx.sender();
        
        // Add coin to treasury balance
        let coin_balance = coin.into_balance();
        treasury.balance.join(coin_balance);
        treasury.total_deposited = treasury.total_deposited + amount;

        // Emit event
        event::emit(DepositMade {
            treasury_id: object::id(treasury),
            amount,
            depositor,
            timestamp: ctx.epoch_timestamp_ms(),
        });
    }

    /// Execute withdrawal (called by proposal module)
    public fun execute_withdrawal(
        treasury: &mut Treasury,
        recipient: address,
        amount: u64,
        category: vector<u8>,
        ctx: &mut TxContext
    ): Coin<SUI> {
        // Check treasury is not frozen
        assert!(!treasury.is_frozen, ETreasuryFrozen);
        assert!(treasury.balance.value() >= amount, EInsufficientBalance);

        // Update spending tracking
        let current_spent = if (treasury.spending_by_category.contains(category)) {
            *treasury.spending_by_category.borrow(category)
        } else {
            0
        };
        
        if (treasury.spending_by_category.contains(category)) {
            let spent_mut = treasury.spending_by_category.borrow_mut(category);
            *spent_mut = current_spent + amount;
        } else {
            treasury.spending_by_category.add(category, amount);
        };

        treasury.total_withdrawn = treasury.total_withdrawn + amount;

        // Emit event
        event::emit(WithdrawalExecuted {
            treasury_id: object::id(treasury),
            amount,
            recipient,
            category,
            timestamp: ctx.epoch_timestamp_ms(),
        });

        // Extract coins
        let withdrawn = treasury.balance.split(amount);
        coin::from_balance(withdrawn, ctx)
    }

    /// Freeze treasury (emergency function)
    public entry fun freeze_treasury(
        treasury: &mut Treasury,
        _admin_cap: &TreasuryAdminCap,
        ctx: &mut TxContext
    ) {
        assert!(object::id(treasury) == _admin_cap.treasury_id, EUnauthorized);
        treasury.is_frozen = true;

        event::emit(TreasuryFrozen {
            treasury_id: object::id(treasury),
            timestamp: ctx.epoch_timestamp_ms(),
        });
    }

    /// Unfreeze treasury
    public entry fun unfreeze_treasury(
        treasury: &mut Treasury,
        _admin_cap: &TreasuryAdminCap,
        ctx: &mut TxContext
    ) {
        assert!(object::id(treasury) == _admin_cap.treasury_id, EUnauthorized);
        treasury.is_frozen = false;

        event::emit(TreasuryUnfrozen {
            treasury_id: object::id(treasury),
            timestamp: ctx.epoch_timestamp_ms(),
        });
    }

    // =================== View Functions ===================
    
    public fun get_balance(treasury: &Treasury): u64 {
        treasury.balance.value()
    }

    public fun get_owners(treasury: &Treasury): vector<address> {
        treasury.owners
    }

    public fun get_threshold(treasury: &Treasury): u8 {
        treasury.threshold
    }

    public fun is_frozen(treasury: &Treasury): bool {
        treasury.is_frozen
    }

    public fun get_total_deposited(treasury: &Treasury): u64 {
        treasury.total_deposited
    }

    public fun get_total_withdrawn(treasury: &Treasury): u64 {
        treasury.total_withdrawn
    }

    public fun is_owner(treasury: &Treasury, addr: address): bool {
        treasury.owners.contains(&addr)
    }

    public fun get_category_spending(treasury: &Treasury, category: vector<u8>): u64 {
        if (treasury.spending_by_category.contains(category)) {
            *treasury.spending_by_category.borrow(category)
        } else {
            0
        }
    }
}
