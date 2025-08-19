import React, { useState, useMemo } from 'react';
import { Clock, CheckCircle, AlertCircle, Send, Download, Upload, Filter } from 'lucide-react';
import { MintDepositAddress, BurnHistoryItem } from '../../types/bridge';
import { fromSatoshi } from '../../utils/bridge';
import { NetworkKey } from '../../config/networks';

interface TransactionHistoryProps {
  mintDepositAddresses: MintDepositAddress[];
  burnHistory: BurnHistoryItem[];
  isLoading?: boolean;
  network: NetworkKey;
}

type TransactionType = 'all' | 'wrap' | 'unwrap';

interface UnifiedTransaction {
  id: string;
  type: 'wrap' | 'unwrap';
  amount: string;
  status: 'pending' | 'completed' | 'expired' | 'not_submitted' | 'submitted' | 'approved';
  address: string;
  timestamp?: number;
  daysUntilExpiration?: number;
  burnIndex?: number;
}

export default function TransactionHistory({ 
  mintDepositAddresses, 
  burnHistory, 
  isLoading = false,
  network 
}: TransactionHistoryProps) {
  const [filter, setFilter] = useState<TransactionType>('all');

  // Convert mint deposit addresses to unified format
  const wrapTransactions: UnifiedTransaction[] = useMemo(() => {
    return mintDepositAddresses.map((deposit, index) => {
      let status: UnifiedTransaction['status'] = 'pending';
      
      if (deposit.daysUntilExpiration <= 0) {
        status = 'expired';
      } else if (deposit.mintedAmount && deposit.mintedAmount !== '0') {
        status = 'completed';
      }

      return {
        id: `wrap-${deposit.depositAddress}-${index}`,
        type: 'wrap' as const,
        amount: deposit.mintedAmount || deposit.depositedAmount || deposit.unconfirmedAmount || '0',
        status,
        address: deposit.depositAddress,
        daysUntilExpiration: deposit.daysUntilExpiration,
      };
    });
  }, [mintDepositAddresses]);

  // Convert burn history to unified format
  const unwrapTransactions: UnifiedTransaction[] = useMemo(() => {
    return burnHistory.map((burn) => {
      let status: UnifiedTransaction['status'] = 'not_submitted';
      
      if (burn.status === 'SUBMITTED') {
        status = 'submitted';
      } else if (burn.status === 'APPROVED') {
        status = 'approved';
      }

      return {
        id: `unwrap-${burn.burnIndex}`,
        type: 'unwrap' as const,
        amount: burn.burnAmount,
        status,
        address: burn.burnDestination,
        burnIndex: burn.burnIndex,
      };
    });
  }, [burnHistory]);

  // Combine and filter transactions
  const allTransactions = useMemo(() => {
    const combined = [...wrapTransactions, ...unwrapTransactions];
    
    if (filter === 'wrap') {
      return wrapTransactions;
    } else if (filter === 'unwrap') {
      return unwrapTransactions;
    }
    
    return combined;
  }, [wrapTransactions, unwrapTransactions, filter]);

  const getStatusIcon = (transaction: UnifiedTransaction) => {
    switch (transaction.status) {
      case 'completed':
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
      case 'submitted':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'not_submitted':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (transaction: UnifiedTransaction) => {
    switch (transaction.status) {
      case 'completed':
        return 'Completed';
      case 'approved':
        return 'Approved';
      case 'pending':
        return 'Pending';
      case 'submitted':
        return 'Submitted';
      case 'expired':
        return 'Expired';
      case 'not_submitted':
        return 'Not submitted';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (transaction: UnifiedTransaction) => {
    switch (transaction.status) {
      case 'completed':
      case 'approved':
        return 'text-green-600 bg-green-50';
      case 'pending':
      case 'submitted':
        return 'text-blue-600 bg-blue-50';
      case 'expired':
        return 'text-red-600 bg-red-50';
      case 'not_submitted':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getTransactionIcon = (type: 'wrap' | 'unwrap') => {
    return type === 'wrap' 
      ? <Upload className="w-4 h-4 text-blue-600" />
      : <Download className="w-4 h-4 text-purple-600" />;
  };

  const getTransactionTypeColor = (type: 'wrap' | 'unwrap') => {
    return type === 'wrap'
      ? 'text-blue-600 bg-blue-50'
      : 'text-purple-600 bg-purple-50';
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
        <p className="text-dark-600">Loading transaction history...</p>
      </div>
    );
  }

  if (allTransactions.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Send className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-dark-900 mb-2">No transactions yet</h3>
          <p className="text-dark-600 mb-4">
            Your wrap and unwrap transactions will appear here
          </p>
          <p className="text-sm text-dark-500">
            Use the bridge to start wrapping Dingocoin to wDingocoin or unwrapping wDingocoin back to Dingocoin
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      {/* Header with filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-dark-900">Transaction History</h2>
          <p className="text-sm text-dark-600 mt-1">
            {allTransactions.length} transaction{allTransactions.length !== 1 ? 's' : ''} on {network.toUpperCase()}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-dark-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as TransactionType)}
            className="px-3 py-2 border border-dark-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Transactions</option>
            <option value="wrap">Wrap Only</option>
            <option value="unwrap">Unwrap Only</option>
          </select>
        </div>
      </div>

      {/* Transaction list */}
      <div className="space-y-4">
        {allTransactions.map((transaction) => (
          <div 
            key={transaction.id}
            className="border border-dark-200 rounded-lg p-4 bg-white hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Transaction type and status */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getTransactionTypeColor(transaction.type)}`}>
                    {getTransactionIcon(transaction.type)}
                    <span>{transaction.type === 'wrap' ? 'Wrap' : 'Unwrap'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(transaction)}
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(transaction)}`}>
                      {getStatusText(transaction)}
                    </span>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-sm text-dark-600 mb-2">
                  <span className="font-medium">Amount:</span> {fromSatoshi(transaction.amount)} DINGO
                </div>

                {/* Address */}
                <div className="text-xs text-dark-500 break-all mb-2">
                  <span className="font-medium">
                    {transaction.type === 'wrap' ? 'Deposit address:' : 'Destination address:'}
                  </span> {transaction.address}
                </div>

                {/* Additional info based on type */}
                {transaction.type === 'wrap' && transaction.daysUntilExpiration !== undefined && (
                  <div className="text-xs text-dark-500">
                    <span className="font-medium">Expires in:</span> {transaction.daysUntilExpiration} days
                  </div>
                )}
              </div>
            </div>

            {/* Status messages */}
            {transaction.status === 'expired' && (
              <div className="mt-3 text-xs text-red-600 bg-red-50 p-2 rounded">
                ⚠️ This deposit address has expired. Create a new one to continue wrapping.
              </div>
            )}

            {transaction.status === 'not_submitted' && transaction.type === 'unwrap' && (
              <div className="mt-3 text-xs text-orange-600 bg-orange-50 p-2 rounded">
                ⚠️ This burn needs to be submitted to the authority nodes for withdrawal processing
              </div>
            )}

            {transaction.status === 'submitted' && transaction.type === 'unwrap' && (
              <div className="mt-3 text-xs text-blue-600 bg-blue-50 p-2 rounded">
                🕐 Withdrawal submitted and pending approval (may take up to 24 hours)
              </div>
            )}

            {transaction.status === 'approved' && transaction.type === 'unwrap' && (
              <div className="mt-3 text-xs text-green-600 bg-green-50 p-2 rounded">
                ✅ Withdrawal approved and processed
              </div>
            )}

            {transaction.status === 'pending' && transaction.type === 'wrap' && (
              <div className="mt-3 text-xs text-blue-600 bg-blue-50 p-2 rounded">
                🕐 Waiting for Dingocoin deposits to this address
              </div>
            )}

            {transaction.status === 'completed' && transaction.type === 'wrap' && (
              <div className="mt-3 text-xs text-green-600 bg-green-50 p-2 rounded">
                ✅ wDingocoin tokens have been minted to your wallet
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Help section */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4 text-sm text-dark-600">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium mb-2">Transaction Types:</p>
            <ul className="text-xs space-y-1 text-dark-500">
              <li><strong>Wrap:</strong> Convert native Dingocoin to wDingocoin tokens</li>
              <li><strong>Unwrap:</strong> Convert wDingocoin tokens back to native Dingocoin</li>
              <li>Wrap transactions require deposits to the generated address</li>
              <li>Unwrap transactions need manual submission for withdrawal</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}