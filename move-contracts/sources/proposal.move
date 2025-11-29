module multisig_treasury::proposal {
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::table::{Self, Table};
    use sui::event;
    use multisig_treasury::treasury::{Self, Treasury};

    // =================== Error Codes ===================
    const ENotOwner: u64 = 1;
    const EAlreadySigned: u64 = 2;
    const ETimeLockNotExpired: u64 = 3;
    const EThresholdNotMet: u64 = 4;
    const EProposalExecuted: u64 = 5;
    const EProposalCancelled: u64 = 6;
    const EInvalidAmount: u64 = 7;
    const ENotProposer: u64 = 8;

    // =================== Constants ===================
    const STATUS_PENDING: u8 = 0;
    const STATUS_EXECUTED: u8 = 1;
    const STATUS_CANCELLED: u8 = 2;

    // =================== Structs ===================
    
    /// Spending proposal requiring multi-sig approval
    public struct Proposal has key, store {
        id: UID,
        treasury_id: ID,
        proposer: address,
        recipient: address,
        amount: u64,
        category: vector<u8>,
        description: vector<u8>,
        time_lock_until: u64,
        signatures: Table<address, bool>,
        signature_count: u64,
        status: u8,
        created_at: u64,
        executed_at: u64,
    }

    // =================== Events ===================
    
    public struct ProposalCreated has copy, drop {
        proposal_id: ID,
        treasury_id: ID,
        proposer: address,
        recipient: address,
        amount: u64,
        category: vector<u8>,
        time_lock_until: u64,
        timestamp: u64,
    }

    public struct ProposalSigned has copy, drop {
        proposal_id: ID,
        signer: address,
        signature_count: u64,
        timestamp: u64,
    }

    public struct ProposalExecuted has copy, drop {
        proposal_id: ID,
        treasury_id: ID,
        recipient: address,
        amount: u64,
        timestamp: u64,
    }

    public struct ProposalCancelled has copy, drop {
        proposal_id: ID,
        cancelled_by: address,
        timestamp: u64,
    }

    // =================== Public Functions ===================
    
    /// Create a new spending proposal
    public entry fun create_proposal(
        treasury: &Treasury,
        recipient: address,
        amount: u64,
        category: vector<u8>,
        description: vector<u8>,
        time_lock_duration: u64, // in milliseconds
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();
        
        // Verify sender is owner
        assert!(treasury::is_owner(treasury, sender), ENotOwner);
        assert!(amount > 0, EInvalidAmount);

        let proposal_uid = object::new(ctx);
        let proposal_id = proposal_uid.to_inner();
        let treasury_id = object::id(treasury);
        let current_time = ctx.epoch_timestamp_ms();

        let proposal = Proposal {
            id: proposal_uid,
            treasury_id,
            proposer: sender,
            recipient,
            amount,
            category,
            description,
            time_lock_until: current_time + time_lock_duration,
            signatures: table::new(ctx),
            signature_count: 0,
            status: STATUS_PENDING,
            created_at: current_time,
            executed_at: 0,
        };

        event::emit(ProposalCreated {
            proposal_id,
            treasury_id,
            proposer: sender,
            recipient,
            amount,
            category,
            time_lock_until: proposal.time_lock_until,
            timestamp: current_time,
        });

        transfer::share_object(proposal);
    }

    /// Sign a proposal (approve it)
    public entry fun sign_proposal(
        proposal: &mut Proposal,
        treasury: &Treasury,
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();
        
        // Verify sender is owner
        assert!(treasury::is_owner(treasury, sender), ENotOwner);
        assert!(object::id(treasury) == proposal.treasury_id, ENotOwner);
        
        // Check proposal status
        assert!(proposal.status == STATUS_PENDING, EProposalExecuted);
        
        // Check if already signed
        assert!(!proposal.signatures.contains(sender), EAlreadySigned);

        // Add signature
        proposal.signatures.add(sender, true);
        proposal.signature_count = proposal.signature_count + 1;

        event::emit(ProposalSigned {
            proposal_id: object::id(proposal),
            signer: sender,
            signature_count: proposal.signature_count,
            timestamp: ctx.epoch_timestamp_ms(),
        });
    }

    /// Execute a proposal after threshold and time-lock are met
    public entry fun execute_proposal(
        proposal: &mut Proposal,
        treasury: &mut Treasury,
        ctx: &mut TxContext
    ) {
        // Check proposal status
        assert!(proposal.status == STATUS_PENDING, EProposalExecuted);
        assert!(object::id(treasury) == proposal.treasury_id, ENotOwner);

        // Check threshold
        let threshold = treasury::get_threshold(treasury);
        assert!(proposal.signature_count >= (threshold as u64), EThresholdNotMet);

        // Check time-lock
        let current_time = ctx.epoch_timestamp_ms();
        assert!(current_time >= proposal.time_lock_until, ETimeLockNotExpired);

        // Execute withdrawal
        let withdrawn_coin = treasury::execute_withdrawal(
            treasury,
            proposal.recipient,
            proposal.amount,
            proposal.category,
            ctx
        );

        // Transfer to recipient
        transfer::public_transfer(withdrawn_coin, proposal.recipient);

        // Update proposal status
        proposal.status = STATUS_EXECUTED;
        proposal.executed_at = current_time;

        event::emit(ProposalExecuted {
            proposal_id: object::id(proposal),
            treasury_id: proposal.treasury_id,
            recipient: proposal.recipient,
            amount: proposal.amount,
            timestamp: current_time,
        });
    }

    /// Cancel a proposal (only by proposer before execution)
    public entry fun cancel_proposal(
        proposal: &mut Proposal,
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();
        
        // Only proposer can cancel
        assert!(proposal.proposer == sender, ENotProposer);
        assert!(proposal.status == STATUS_PENDING, EProposalExecuted);

        proposal.status = STATUS_CANCELLED;

        event::emit(ProposalCancelled {
            proposal_id: object::id(proposal),
            cancelled_by: sender,
            timestamp: ctx.epoch_timestamp_ms(),
        });
    }

    // =================== View Functions ===================
    
    public fun get_signature_count(proposal: &Proposal): u64 {
        proposal.signature_count
    }

    public fun get_status(proposal: &Proposal): u8 {
        proposal.status
    }

    public fun has_signed(proposal: &Proposal, signer: address): bool {
        proposal.signatures.contains(signer)
    }

    public fun get_amount(proposal: &Proposal): u64 {
        proposal.amount
    }

    public fun get_recipient(proposal: &Proposal): address {
        proposal.recipient
    }

    public fun get_time_lock_until(proposal: &Proposal): u64 {
        proposal.time_lock_until
    }

    public fun is_ready_to_execute(proposal: &Proposal, treasury: &Treasury, current_time: u64): bool {
        let threshold = treasury::get_threshold(treasury);
        proposal.status == STATUS_PENDING &&
        proposal.signature_count >= (threshold as u64) &&
        current_time >= proposal.time_lock_until
    }
}
