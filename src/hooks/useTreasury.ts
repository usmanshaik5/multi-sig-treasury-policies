"use client"

/**
 * Treasury Hook
 * 
 * Custom hook for interacting with Treasury contracts
 */

import { useState, useCallback } from 'react';
import { useSignAndExecuteTransactionBlock, useSuiClient } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { PACKAGE_ID, GAS_BUDGET } from '@/lib/sui-config';
import { toast } from 'sonner';

export function useTreasury() {
  const client = useSuiClient();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransactionBlock();
  const [loading, setLoading] = useState(false);

  const createTreasury = useCallback(async (
    owners: string[],
    threshold: number
  ) => {
    setLoading(true);
    try {
      const tx = new TransactionBlock();

      tx.moveCall({
        target: `${PACKAGE_ID}::treasury::create_treasury`,
        arguments: [
          tx.pure(owners),
          tx.pure(threshold, 'u8'),
        ],
      });

      tx.setGasBudget(GAS_BUDGET.CREATE_TREASURY);

      const result = await signAndExecute({
        transactionBlock: tx,
        options: {
          showEffects: true,
          showObjectChanges: true,
          showEvents: true,
        },
      });

      // Extract treasury object ID from object changes
      const treasuryObject = result.objectChanges?.find(
        (change: any) => change.type === 'created' && change.objectType?.includes('::treasury::Treasury')
      );

      toast.success('Treasury created successfully!');
      
      return {
        success: true,
        digest: result.digest,
        treasuryId: treasuryObject?.objectId,
        result,
      };
    } catch (error: any) {
      console.error('Create treasury error:', error);
      toast.error(error.message || 'Failed to create treasury');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [signAndExecute]);

  const deposit = useCallback(async (
    treasuryId: string,
    amount: bigint
  ) => {
    setLoading(true);
    try {
      const tx = new TransactionBlock();

      // Split coin for deposit
      const [coin] = tx.splitCoins(tx.gas, [tx.pure(amount)]);

      tx.moveCall({
        target: `${PACKAGE_ID}::treasury::deposit`,
        arguments: [
          tx.object(treasuryId),
          coin,
        ],
      });

      tx.setGasBudget(GAS_BUDGET.DEPOSIT);

      const result = await signAndExecute({
        transactionBlock: tx,
        options: {
          showEffects: true,
          showEvents: true,
        },
      });

      toast.success(`Deposited ${Number(amount) / 1_000_000_000} SUI to treasury`);
      
      return {
        success: true,
        digest: result.digest,
        result,
      };
    } catch (error: any) {
      console.error('Deposit error:', error);
      toast.error(error.message || 'Failed to deposit');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [signAndExecute]);

  const getTreasuryBalance = useCallback(async (treasuryId: string) => {
    try {
      const object = await client.getObject({
        id: treasuryId,
        options: { showContent: true },
      });

      if (object.data?.content && 'fields' in object.data.content) {
        const fields = object.data.content.fields as any;
        const balance = fields.balance || '0';
        return BigInt(balance);
      }

      return BigInt(0);
    } catch (error) {
      console.error('Error fetching treasury balance:', error);
      return BigInt(0);
    }
  }, [client]);

  const getTreasuryDetails = useCallback(async (treasuryId: string) => {
    try {
      const object = await client.getObject({
        id: treasuryId,
        options: { showContent: true },
      });

      if (object.data?.content && 'fields' in object.data.content) {
        const fields = object.data.content.fields as any;
        
        return {
          id: treasuryId,
          owners: fields.owners || [],
          threshold: Number(fields.threshold || 0),
          balance: BigInt(fields.balance || 0),
          isFrozen: fields.is_frozen || false,
          totalDeposited: BigInt(fields.total_deposited || 0),
          totalWithdrawn: BigInt(fields.total_withdrawn || 0),
          createdAt: Number(fields.created_at || 0),
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching treasury details:', error);
      return null;
    }
  }, [client]);

  return {
    createTreasury,
    deposit,
    getTreasuryBalance,
    getTreasuryDetails,
    loading,
  };
}
