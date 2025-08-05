export interface AuthorityNode {
  location: string;
  port: number;
  walletAddress: string;
}

export interface MintDepositAddress {
  depositAddress: string;
  unconfirmedAmount: string;
  depositedAmount: string;
  mintedAmount: string;
  daysUntilExpiration: number;
}

export interface BurnHistoryItem {
  burnIndex: number;
  burnDestination: string;
  burnAmount: string;
  status: 'SUBMITTED' | 'APPROVED' | null;
}

export interface BridgeStats {
  totalSupply: string;
  unconfirmedUtxos: {
    totalChangeBalance: string;
    totalDepositsBalance: string;
  };
  unconfirmedDeposits: {
    totalDepositedAmount: string;
  };
  withdrawals: {
    totalApprovedAmount: string;
    totalApprovableAmount: string;
  };
}

export interface NetworkConfig {
  name: string;
  chainId: number;
  contractAddress: string;
  authorityNodes: AuthorityNode[];
  authorityThreshold: number;
  decimals: number;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export type BridgeDirection = 'wrap' | 'unwrap';

export interface BridgeTransaction {
  id: string;
  direction: BridgeDirection;
  amount: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: number;
  txHash?: string;
  destinationAddress?: string;
} 