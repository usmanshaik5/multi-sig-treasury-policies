"use client"

/**
 * Policy Hook
 * 
 * Custom hook for interacting with PolicyManager contracts
 */

import { useState, useCallback } from 'react';
import { useSignAndExecuteTransactionBlock, useSuiClient } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { PACKAGE_ID, GAS_BUDGET } from '@/lib/sui-config';
import { toast } from 'sonner';

export function usePolicy() {
  const client = useSuiClient();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransactionBlock();
  const [loading, setLoading] = useState(false);

  const createPolicyConfig = useCallback(async (
    treasuryId: string,
    globalDailyLimit: bigint,
    globalWeeklyLimit: bigint,
    globalMonthlyLimit: bigint,
    maxSingleTransaction: bigint,
    baseTimeLock: number,
    timeLockFactor: number
  ) => {
    setLoading(true);
    try {
      const tx = new TransactionBlock();

      tx.moveCall({
        target: `${PACKAGE_ID}::policy_manager::create_policy_config`,
        arguments: [
          tx.pure(treasuryId),
          tx.pure(globalDailyLimit, 'u64'),
          tx.pure(globalWeeklyLimit, 'u64'),
          tx.pure(globalMonthlyLimit, 'u64'),
          tx.pure(maxSingleTransaction, 'u64'),
          tx.pure(baseTimeLock, 'u64'),
          tx.pure(timeLockFactor, 'u64'),
        ],
      });

      tx.setGasBudget(GAS_BUDGET.CREATE_POLICY);

      const result = await signAndExecute({
        transactionBlock: tx,
        options: {
          showEffects: true,
          showObjectChanges: true,
          showEvents: true,
        },
      });

      const policyObject = result.objectChanges?.find(
        (change: any) => change.type === 'created' && change.objectType?.includes('::policy_manager::PolicyConfig')
      );

      toast.success('Policy configuration created!');
      
      return {
        success: true,
        digest: result.digest,
        policyConfigId: policyObject?.objectId,
        result,
      };
    } catch (error: any) {
      console.error('Create policy config error:', error);
      toast.error(error.message || 'Failed to create policy config');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [signAndExecute]);

  const setCategoryLimit = useCallback(async (
    policyConfigId: string,
    category: string,
    period: number,
    limit: bigint
  ) => {
    setLoading(true);
    try {
      const tx = new TransactionBlock();

      tx.moveCall({
        target: `${PACKAGE_ID}::policy_manager::set_category_limit`,
        arguments: [
          tx.object(policyConfigId),
          tx.pure(Array.from(new TextEncoder().encode(category))),
          tx.pure(period, 'u8'),
          tx.pure(limit, 'u64'),
        ],
      });

      tx.setGasBudget(GAS_BUDGET.UPDATE_POLICY);

      const result = await signAndExecute({
        transactionBlock: tx,
        options: {
          showEffects: true,
          showEvents: true,
        },
      });

      toast.success(`Category limit set for ${category}`);
      
      return {
        success: true,
        digest: result.digest,
        result,
      };
    } catch (error: any) {
      console.error('Set category limit error:', error);
      toast.error(error.message || 'Failed to set category limit');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [signAndExecute]);

  const addToWhitelist = useCallback(async (
    policyConfigId: string,
    recipient: string,
    expiration: number
  ) => {
    setLoading(true);
    try {
      const tx = new TransactionBlock();

      tx.moveCall({
        target: `${PACKAGE_ID}::policy_manager::add_to_whitelist`,
        arguments: [
          tx.object(policyConfigId),
          tx.pure(recipient, 'address'),
          tx.pure(expiration, 'u64'),
        ],
      });

      tx.setGasBudget(GAS_BUDGET.UPDATE_POLICY);

      const result = await signAndExecute({
        transactionBlock: tx,
        options: {
          showEffects: true,
          showEvents: true,
        },
      });

      toast.success('Address added to whitelist');
      
      return {
        success: true,
        digest: result.digest,
        result,
      };
    } catch (error: any) {
      console.error('Add to whitelist error:', error);
      toast.error(error.message || 'Failed to add to whitelist');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [signAndExecute]);

  const addThresholdTier = useCallback(async (
    policyConfigId: string,
    maxAmount: bigint,
    requiredSignatures: number
  ) => {
    setLoading(true);
    try {
      const tx = new TransactionBlock();

      tx.moveCall({
        target: `${PACKAGE_ID}::policy_manager::add_threshold_tier`,
        arguments: [
          tx.object(policyConfigId),
          tx.pure(maxAmount, 'u64'),
          tx.pure(requiredSignatures, 'u8'),
        ],
      });

      tx.setGasBudget(GAS_BUDGET.UPDATE_POLICY);

      const result = await signAndExecute({
        transactionBlock: tx,
        options: {
          showEffects: true,
          showEvents: true,
        },
      });

      toast.success('Threshold tier added');
      
      return {
        success: true,
        digest: result.digest,
        result,
      };
    } catch (error: any) {
      console.error('Add threshold tier error:', error);
      toast.error(error.message || 'Failed to add threshold tier');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [signAndExecute]);

  return {
    createPolicyConfig,
    setCategoryLimit,
    addToWhitelist,
    addThresholdTier,
    loading,
  };
}
