/**
 * Sui Blockchain Configuration
 * 
 * After deploying your Move contracts, update the PACKAGE_ID below.
 * See move-contracts/deployment-info.json for your deployed package ID.
 */

// =================== Network Configuration ===================

export const NETWORK = 'testnet' as const;

export const NETWORKS = {
  mainnet: 'https://fullnode.mainnet.sui.io:443',
  testnet: 'https://fullnode.testnet.sui.io:443',
  devnet: 'https://fullnode.devnet.sui.io:443',
  localnet: 'http://127.0.0.1:9000',
} as const;

export const RPC_URL = NETWORKS[NETWORK];

// =================== Contract Configuration ===================

/**
 * IMPORTANT: Update this after deployment!
 * 
 * Run: ./move-contracts/scripts/deploy.sh
 * Then copy the Package ID from the output
 */
export const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID || '0x0';

// =================== Module Names ===================

export const MODULES = {
  TREASURY: 'treasury',
  PROPOSAL: 'proposal',
  POLICY_MANAGER: 'policy_manager',
  EMERGENCY: 'emergency',
} as const;

// =================== Function Names ===================

export const TREASURY_FUNCTIONS = {
  CREATE_TREASURY: 'create_treasury',
  DEPOSIT: 'deposit',
  EXECUTE_WITHDRAWAL: 'execute_withdrawal',
  FREEZE_TREASURY: 'freeze_treasury',
  UNFREEZE_TREASURY: 'unfreeze_treasury',
  GET_BALANCE: 'get_balance',
  GET_OWNERS: 'get_owners',
  GET_THRESHOLD: 'get_threshold',
  IS_FROZEN: 'is_frozen',
} as const;

export const PROPOSAL_FUNCTIONS = {
  CREATE_PROPOSAL: 'create_proposal',
  SIGN_PROPOSAL: 'sign_proposal',
  EXECUTE_PROPOSAL: 'execute_proposal',
  CANCEL_PROPOSAL: 'cancel_proposal',
  GET_SIGNATURE_COUNT: 'get_signature_count',
  GET_STATUS: 'get_status',
  HAS_SIGNED: 'has_signed',
} as const;

export const POLICY_FUNCTIONS = {
  CREATE_POLICY_CONFIG: 'create_policy_config',
  SET_CATEGORY_LIMIT: 'set_category_limit',
  ADD_TO_WHITELIST: 'add_to_whitelist',
  ADD_TO_BLACKLIST: 'add_to_blacklist',
  VALIDATE_TRANSACTION: 'validate_transaction',
  CALCULATE_TIME_LOCK: 'calculate_time_lock',
  ADD_THRESHOLD_TIER: 'add_threshold_tier',
} as const;

export const EMERGENCY_FUNCTIONS = {
  CREATE_EMERGENCY_CONFIG: 'create_emergency_config',
  CREATE_EMERGENCY_PROPOSAL: 'create_emergency_proposal',
  SIGN_EMERGENCY_PROPOSAL: 'sign_emergency_proposal',
  EXECUTE_EMERGENCY_WITHDRAWAL: 'execute_emergency_withdrawal',
} as const;

// =================== Helper Functions ===================

export function getModuleName(module: keyof typeof MODULES): string {
  return `${PACKAGE_ID}::${MODULES[module]}`;
}

export function getFunctionName(
  module: keyof typeof MODULES,
  functionName: string
): string {
  return `${PACKAGE_ID}::${MODULES[module]}::${functionName}`;
}

// =================== Constants ===================

export const PROPOSAL_STATUS = {
  PENDING: 0,
  EXECUTED: 1,
  CANCELLED: 2,
} as const;

export const PERIOD_TYPE = {
  DAILY: 0,
  WEEKLY: 1,
  MONTHLY: 2,
} as const;

export const CATEGORIES = [
  'Operations',
  'Marketing',
  'Development',
  'Grants',
  'Emergency',
  'Other',
] as const;

// =================== Type Definitions ===================

export type Network = keyof typeof NETWORKS;
export type Module = keyof typeof MODULES;
export type Category = typeof CATEGORIES[number];

export interface TreasuryConfig {
  owners: string[];
  threshold: number;
}

export interface ProposalData {
  id: string;
  treasuryId: string;
  proposer: string;
  recipient: string;
  amount: number;
  category: string;
  description: string;
  timeLockUntil: number;
  signatureCount: number;
  status: number;
  createdAt: number;
  executedAt: number;
}

export interface PolicyConfigData {
  id: string;
  treasuryId: string;
  globalDailyLimit: number;
  globalWeeklyLimit: number;
  globalMonthlyLimit: number;
  maxSingleTransaction: number;
  baseTimeLock: number;
  timeLockFactor: number;
}

// =================== Validation ===================

export function validatePackageId(): boolean {
  return PACKAGE_ID !== '0x0' && PACKAGE_ID.startsWith('0x');
}

export function getExplorerUrl(objectId: string, type: 'object' | 'txblock' = 'object'): string {
  return `https://suiexplorer.com/${type}/${objectId}?network=${NETWORK}`;
}

// =================== Gas Budget ===================

export const GAS_BUDGET = {
  CREATE_TREASURY: 10_000_000n,
  DEPOSIT: 5_000_000n,
  CREATE_PROPOSAL: 10_000_000n,
  SIGN_PROPOSAL: 5_000_000n,
  EXECUTE_PROPOSAL: 15_000_000n,
  CREATE_POLICY: 10_000_000n,
  UPDATE_POLICY: 5_000_000n,
  EMERGENCY_WITHDRAWAL: 15_000_000n,
} as const;
