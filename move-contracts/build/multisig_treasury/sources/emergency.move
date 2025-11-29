module multisig_treasury::emergency {
    use sui::coin::Coin;
    use sui::sui::SUI;
    use sui::table::{Self, Table};
    use sui::event;
    use multisig_treasury::treasury::{Self, Treasury};

    // =================== Error Codes ===================
    const ENotEmergencySigner: u64 = 1;
    const ECooldownNotExpired: u64 = 2;
    const EEmergencyThresholdNotMet: u64 = 3;
    const EAlreadySigned: u64 = 4;
    const EProposalExecuted: u64 = 5;

    // =================== Constants ===================
    const STATUS_PENDING: u8 = 0;
    const STATUS_EXECUTED: u8 = 1;
    const STATUS_CANCELLED: u8 = 2;

    // =================== Structs ===================
    
    /// Emergency configuration for a treasury
    public struct EmergencyConfig has key, store {
        id: UID,
        treasury_id: ID,
        emergency_signers: vector<address>,
        emergency_threshold: u8, // Higher threshold for emergencies
        cooldown_period: u64, // Minimum time between emergencies (ms)
        last_emergency_timestamp: u64,
    }

    /// Emergency withdrawal proposal
    public struct EmergencyProposal has key, store {
        id: UID,
        treasury_id: ID,
        proposer: address,
        recipient: address,
        amount: u64,
        justification: vector<u8>,
        signatures: Table<address, bool>,
        signature_count: u64,
        status: u8,
        created_at: u64,
        executed_at: u64,
    }

    // =================== Events ===================
    
    public struct EmergencyConfigCreated has copy, drop {
        config_id: ID,
        treasury_id: ID,
        emergency_threshold: u8,
        timestamp: u64,
    }

    public struct EmergencyProposalCreated has copy, drop {
        proposal_id: ID,
        treasury_id: ID,
        proposer: address,
        amount: u64,
        timestamp: u64,
    }

    public struct EmergencyProposalSigned has copy, drop {
        proposal_id: ID,
        signer: address,
        signature_count: u64,
        timestamp: u64,
    }

    public struct EmergencyWithdrawalExecuted has copy, drop {
        proposal_id: ID,
        treasury_id: ID,
        recipient: address,
        amount: u64,
        justification: vector<u8>,
        timestamp: u64,
    }

    public struct EmergencyCooldownViolation has copy, drop {
        treasury_id: ID,
        time_remaining: u64,
        timestamp: u64,
    }

    // =================== Public Functions ===================
    
    /// Create emergency configuration for a treasury
    public entry fun create_emergency_config(
        treasury_id: ID,
        emergency_signers: vector<address>,
        emergency_threshold: u8,
        cooldown_period: u64,
        ctx: &mut TxContext
    ) {
        let config_uid = object::new(ctx);
        let config_id = config_uid.to_inner();

        let emergency_config = EmergencyConfig {
            id: config_uid,
            treasury_id,
            emergency_signers,
            emergency_threshold,
            cooldown_period,
            last_emergency_timestamp: 0,
        };

        event::emit(EmergencyConfigCreated {
            config_id,
            treasury_id,
            emergency_threshold,
            timestamp: ctx.epoch_timestamp_ms(),
        });

        transfer::share_object(emergency_config);
    }

    /// Create emergency withdrawal proposal
    public entry fun create_emergency_proposal(
        config: &EmergencyConfig,
        treasury: &Treasury,
        recipient: address,
        amount: u64,
        justification: vector<u8>,
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();
        let current_time = ctx.epoch_timestamp_ms();
        
        // Verify sender is emergency signer
        assert!(config.emergency_signers.contains(&sender), ENotEmergencySigner);
        assert!(object::id(treasury) == config.treasury_id, ENotEmergencySigner);

        // Check cooldown period
        if (config.last_emergency_timestamp > 0) {
            let time_since_last = current_time - config.last_emergency_timestamp;
            if (time_since_last < config.cooldown_period) {
                event::emit(EmergencyCooldownViolation {
                    treasury_id: config.treasury_id,
                    time_remaining: config.cooldown_period - time_since_last,
                    timestamp: current_time,
                });
                assert!(false, ECooldownNotExpired);
            };
        };

        let proposal_uid = object::new(ctx);
        let proposal_id = proposal_uid.to_inner();

        let proposal = EmergencyProposal {
            id: proposal_uid,
            treasury_id: config.treasury_id,
            proposer: sender,
            recipient,
            amount,
            justification,
            signatures: table::new(ctx),
            signature_count: 0,
            status: STATUS_PENDING,
            created_at: current_time,
            executed_at: 0,
        };

        event::emit(EmergencyProposalCreated {
            proposal_id,
            treasury_id: config.treasury_id,
            proposer: sender,
            amount,
            timestamp: current_time,
        });

        transfer::share_object(proposal);
    }

    /// Sign emergency proposal
    public entry fun sign_emergency_proposal(
        proposal: &mut EmergencyProposal,
        config: &EmergencyConfig,
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();
        
        // Verify sender is emergency signer
        assert!(config.emergency_signers.contains(&sender), ENotEmergencySigner);
        assert!(proposal.treasury_id == config.treasury_id, ENotEmergencySigner);
        
        // Check proposal status
        assert!(proposal.status == STATUS_PENDING, EProposalExecuted);
        
        // Check if already signed
        assert!(!proposal.signatures.contains(sender), EAlreadySigned);

        // Add signature
        proposal.signatures.add(sender, true);
        proposal.signature_count = proposal.signature_count + 1;

        event::emit(EmergencyProposalSigned {
            proposal_id: object::id(proposal),
            signer: sender,
            signature_count: proposal.signature_count,
            timestamp: ctx.epoch_timestamp_ms(),
        });
    }

    /// Execute emergency withdrawal
    public entry fun execute_emergency_withdrawal(
        proposal: &mut EmergencyProposal,
        config: &mut EmergencyConfig,
        treasury: &mut Treasury,
        ctx: &mut TxContext
    ) {
        let current_time = ctx.epoch_timestamp_ms();
        
        // Check proposal status
        assert!(proposal.status == STATUS_PENDING, EProposalExecuted);
        assert!(object::id(treasury) == proposal.treasury_id, ENotEmergencySigner);
        assert!(proposal.treasury_id == config.treasury_id, ENotEmergencySigner);

        // Check emergency threshold
        assert!(
            proposal.signature_count >= (config.emergency_threshold as u64),
            EEmergencyThresholdNotMet
        );

        // Execute withdrawal with EMERGENCY category
        let withdrawn_coin = treasury::execute_withdrawal(
            treasury,
            proposal.recipient,
            proposal.amount,
            b"EMERGENCY",
            ctx
        );

        // Transfer to recipient
        transfer::public_transfer(withdrawn_coin, proposal.recipient);

        // Update proposal status
        proposal.status = STATUS_EXECUTED;
        proposal.executed_at = current_time;

        // Update config cooldown
        config.last_emergency_timestamp = current_time;

        event::emit(EmergencyWithdrawalExecuted {
            proposal_id: object::id(proposal),
            treasury_id: proposal.treasury_id,
            recipient: proposal.recipient,
            amount: proposal.amount,
            justification: proposal.justification,
            timestamp: current_time,
        });
    }

    // =================== View Functions ===================
    
    public fun get_emergency_threshold(config: &EmergencyConfig): u8 {
        config.emergency_threshold
    }

    public fun get_cooldown_period(config: &EmergencyConfig): u64 {
        config.cooldown_period
    }

    public fun get_last_emergency_timestamp(config: &EmergencyConfig): u64 {
        config.last_emergency_timestamp
    }

    public fun is_emergency_signer(config: &EmergencyConfig, addr: address): bool {
        config.emergency_signers.contains(&addr)
    }

    public fun can_create_emergency_proposal(config: &EmergencyConfig, current_time: u64): bool {
        if (config.last_emergency_timestamp == 0) {
            return true
        };
        
        let time_since_last = current_time - config.last_emergency_timestamp;
        time_since_last >= config.cooldown_period
    }
}
