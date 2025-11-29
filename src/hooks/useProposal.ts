"use client"

/**
 * Proposal Hook
 * 
 * Custom hook for interacting with Proposal contracts
 */

import { useState, useCallback } from 'react';
import { useSignAndExecuteTransactionBlock, useSuiClient } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { PACKAGE_ID, GAS_BUDGET, PROPOSAL_STATUS } from '@/lib/sui-config';
import { toast } from 'sonner';

export function useProposal() {
  const client = useSuiClient();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransactionBlock();
  const [loading, setLoading] = useState(false);

  const createProposal = useCallback(async (
    treasuryId: string,
    recipient: string,
    amount: bigint,
    category: string,
    description: string,
    timeLockDuration: number
  ) => {
    setLoading(true);
    try {
      const tx = new TransactionBlock();

      tx.moveCall({
        target: `${PACKAGE_ID}::proposal::create_proposal`,
        arguments: [
          tx.object(treasuryId),
          tx.pure(recipient, 'address'),
          tx.pure(amount, 'u64'),
          tx.pure(Array.from(new TextEncoder().encode(category))),
          tx.pure(Array.from(new TextEncoder().encode(description))),
          tx.pure(timeLockDuration, 'u64'),
        ],
      });

      tx.setGasBudget(GAS_BUDGET.CREATE_PROPOSAL);

      const result = await signAndExecute({
        transactionBlock: tx,
        options: {
          showEffects: true,
          showObjectChanges: true,
          showEvents: true,
        },
      });

      // Extract proposal object ID
      const proposalObject = result.objectChanges?.find(
        (change: any) => change.type === 'created' && change.objectType?.includes('::proposal::Proposal')
      );

      toast.success('Proposal created successfully!');
      
      return {
        success: true,
        digest: result.digest,
        proposalId: proposalObject?.objectId,
        result,
      };
    } catch (error: any) {
      console.error('Create proposal error:', error);
      toast.error(error.message || 'Failed to create proposal');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [signAndExecute]);

  const signProposal = useCallback(async (
    proposalId: string,
    treasuryId: string
  ) => {
    setLoading(true);
    try {
      const tx = new TransactionBlock();

      tx.moveCall({
        target: `${PACKAGE_ID}::proposal::sign_proposal`,
        arguments: [
          tx.object(proposalId),
          tx.object(treasuryId),
        ],
      });

      tx.setGasBudget(GAS_BUDGET.SIGN_PROPOSAL);

      const result = await signAndExecute({
        transactionBlock: tx,
        options: {
          showEffects: true,
          showEvents: true,
        },
      });

      toast.success('Proposal signed!');
      
      return {
        success: true,
        digest: result.digest,
        result,
      };
    } catch (error: any) {
      console.error('Sign proposal error:', error);
      toast.error(error.message || 'Failed to sign proposal');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [signAndExecute]);

  const executeProposal = useCallback(async (
    proposalId: string,
    treasuryId: string
  ) => {
    setLoading(true);
    try {
      const tx = new TransactionBlock();

      tx.moveCall({
        target: `${PACKAGE_ID}::proposal::execute_proposal`,
        arguments: [
          tx.object(proposalId),
          tx.object(treasuryId),
        ],
      });

      tx.setGasBudget(GAS_BUDGET.EXECUTE_PROPOSAL);

      const result = await signAndExecute({
        transactionBlock: tx,
        options: {
          showEffects: true,
          showEvents: true,
        },
      });

      toast.success('Proposal executed successfully!');
      
      return {
        success: true,
        digest: result.digest,
        result,
      };
    } catch (error: any) {
      console.error('Execute proposal error:', error);
      toast.error(error.message || 'Failed to execute proposal');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [signAndExecute]);

  const cancelProposal = useCallback(async (proposalId: string) => {
    setLoading(true);
    try {
      const tx = new TransactionBlock();

      tx.moveCall({
        target: `${PACKAGE_ID}::proposal::cancel_proposal`,
        arguments: [tx.object(proposalId)],
      });

      tx.setGasBudget(GAS_BUDGET.SIGN_PROPOSAL);

      const result = await signAndExecute({
        transactionBlock: tx,
        options: {
          showEffects: true,
          showEvents: true,
        },
      });

      toast.success('Proposal cancelled');
      
      return {
        success: true,
        digest: result.digest,
        result,
      };
    } catch (error: any) {
      console.error('Cancel proposal error:', error);
      toast.error(error.message || 'Failed to cancel proposal');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [signAndExecute]);

  const getProposalDetails = useCallback(async (proposalId: string) => {
    try {
      const object = await client.getObject({
        id: proposalId,
        options: { showContent: true },
      });

      if (object.data?.content && 'fields' in object.data.content) {
        const fields = object.data.content.fields as any;
        
        return {
          id: proposalId,
          treasuryId: fields.treasury_id,
          proposer: fields.proposer,
          recipient: fields.recipient,
          amount: BigInt(fields.amount || 0),
          category: new TextDecoder().decode(new Uint8Array(fields.category || [])),
          description: new TextDecoder().decode(new Uint8Array(fields.description || [])),
          timeLockUntil: Number(fields.time_lock_until || 0),
          signatureCount: Number(fields.signature_count || 0),
          status: Number(fields.status || 0),
          createdAt: Number(fields.created_at || 0),
          executedAt: Number(fields.executed_at || 0),
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching proposal details:', error);
      return null;
    }
  }, [client]);

  return {
    createProposal,
    signProposal,
    executeProposal,
    cancelProposal,
    getProposalDetails,
    loading,
  };
}
