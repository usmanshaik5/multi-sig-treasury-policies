/**
 * Sui Client Utilities
 * 
 * Provides helper functions for interacting with Sui blockchain
 */

import { SuiClient, SuiObjectResponse, SuiTransactionBlockResponse } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { RPC_URL, PACKAGE_ID, GAS_BUDGET } from './sui-config';

// =================== Client Instance ===================

export const suiClient = new SuiClient({ url: RPC_URL });

// =================== Treasury Functions ===================

export async function createTreasury(
  owners: string[],
  threshold: number,
  signer: any // Wallet signer
): Promise<SuiTransactionBlockResponse> {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${PACKAGE_ID}::treasury::create_treasury`,
    arguments: [
      tx.pure(owners),
      tx.pure(threshold, 'u8'),
    ],
  });

  tx.setGasBudget(GAS_BUDGET.CREATE_TREASURY);

  return await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    options: {
      showEffects: true,
      showObjectChanges: true,
      showEvents: true,
    },
  });
}

export async function depositToTreasury(
  treasuryId: string,
  coinId: string,
  signer: any
): Promise<SuiTransactionBlockResponse> {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${PACKAGE_ID}::treasury::deposit`,
    arguments: [
      tx.object(treasuryId),
      tx.object(coinId),
    ],
  });

  tx.setGasBudget(GAS_BUDGET.DEPOSIT);

  return await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    options: {
      showEffects: true,
      showEvents: true,
    },
  });
}

export async function getTreasuryBalance(treasuryId: string): Promise<number> {
  try {
    const object = await suiClient.getObject({
      id: treasuryId,
      options: { showContent: true },
    });

    if (object.data?.content && 'fields' in object.data.content) {
      const fields = object.data.content.fields as any;
      return Number(fields.balance || 0);
    }

    return 0;
  } catch (error) {
    console.error('Error fetching treasury balance:', error);
    return 0;
  }
}

// =================== Proposal Functions ===================

export async function createProposal(
  treasuryId: string,
  recipient: string,
  amount: number,
  category: string,
  description: string,
  timeLockDuration: number,
  signer: any
): Promise<SuiTransactionBlockResponse> {
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

  return await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    options: {
      showEffects: true,
      showObjectChanges: true,
      showEvents: true,
    },
  });
}

export async function signProposal(
  proposalId: string,
  treasuryId: string,
  signer: any
): Promise<SuiTransactionBlockResponse> {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${PACKAGE_ID}::proposal::sign_proposal`,
    arguments: [
      tx.object(proposalId),
      tx.object(treasuryId),
    ],
  });

  tx.setGasBudget(GAS_BUDGET.SIGN_PROPOSAL);

  return await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    options: {
      showEffects: true,
      showEvents: true,
    },
  });
}

export async function executeProposal(
  proposalId: string,
  treasuryId: string,
  signer: any
): Promise<SuiTransactionBlockResponse> {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${PACKAGE_ID}::proposal::execute_proposal`,
    arguments: [
      tx.object(proposalId),
      tx.object(treasuryId),
    ],
  });

  tx.setGasBudget(GAS_BUDGET.EXECUTE_PROPOSAL);

  return await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    options: {
      showEffects: true,
      showEvents: true,
    },
  });
}

export async function cancelProposal(
  proposalId: string,
  signer: any
): Promise<SuiTransactionBlockResponse> {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${PACKAGE_ID}::proposal::cancel_proposal`,
    arguments: [tx.object(proposalId)],
  });

  tx.setGasBudget(GAS_BUDGET.SIGN_PROPOSAL);

  return await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    options: {
      showEffects: true,
      showEvents: true,
    },
  });
}

// =================== Policy Functions ===================

export async function createPolicyConfig(
  treasuryId: string,
  globalDailyLimit: number,
  globalWeeklyLimit: number,
  globalMonthlyLimit: number,
  maxSingleTransaction: number,
  baseTimeLock: number,
  timeLockFactor: number,
  signer: any
): Promise<SuiTransactionBlockResponse> {
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

  return await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    options: {
      showEffects: true,
      showObjectChanges: true,
      showEvents: true,
    },
  });
}

export async function addToWhitelist(
  policyConfigId: string,
  recipient: string,
  expiration: number,
  signer: any
): Promise<SuiTransactionBlockResponse> {
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

  return await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
    options: {
      showEffects: true,
      showEvents: true,
    },
  });
}

// =================== Query Functions ===================

export async function getOwnedObjects(address: string): Promise<SuiObjectResponse[]> {
  const objects = await suiClient.getOwnedObjects({
    owner: address,
    options: {
      showType: true,
      showContent: true,
      showDisplay: true,
    },
  });

  return objects.data;
}

export async function getObjectById(objectId: string): Promise<SuiObjectResponse> {
  return await suiClient.getObject({
    id: objectId,
    options: {
      showType: true,
      showContent: true,
      showOwner: true,
      showDisplay: true,
    },
  });
}

export async function getTransactionBlock(digest: string): Promise<SuiTransactionBlockResponse> {
  return await suiClient.getTransactionBlock({
    digest,
    options: {
      showEffects: true,
      showEvents: true,
      showObjectChanges: true,
      showInput: true,
    },
  });
}

// =================== Event Functions ===================

export async function getEventsByType(eventType: string, limit: number = 50) {
  return await suiClient.queryEvents({
    query: { MoveEventType: eventType },
    limit,
    order: 'descending',
  });
}

export async function getTreasuryEvents(treasuryId: string) {
  // Query treasury-related events
  const depositEvents = await getEventsByType(`${PACKAGE_ID}::treasury::DepositMade`);
  const withdrawalEvents = await getEventsByType(`${PACKAGE_ID}::treasury::WithdrawalExecuted`);

  return {
    deposits: depositEvents.data,
    withdrawals: withdrawalEvents.data,
  };
}

// =================== Utility Functions ===================

export function formatSuiAmount(amount: number | bigint): string {
  const sui = Number(amount) / 1_000_000_000;
  return sui.toFixed(4);
}

export function parseSuiAmount(sui: string): bigint {
  return BigInt(Math.floor(parseFloat(sui) * 1_000_000_000));
}

export function shortenAddress(address: string, chars: number = 6): string {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export async function waitForTransaction(
  digest: string,
  timeout: number = 30000
): Promise<SuiTransactionBlockResponse> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const tx = await getTransactionBlock(digest);
      if (tx.effects?.status) {
        return tx;
      }
    } catch (error) {
      // Transaction not yet indexed
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  throw new Error('Transaction timeout');
}
