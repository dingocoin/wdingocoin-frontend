import React from 'react';
import { Clock, CheckCircle, AlertCircle, Send } from 'lucide-react';
import { BurnHistoryItem } from '../../types/bridge';
import { fromSatoshi } from '../../utils/bridge';

interface BurnHistoryProps {
  burnHistory: BurnHistoryItem[];
  onSubmitWithdrawal: (burnIndex: number) => Promise<void>;
  isLoading?: boolean;
}

export default function BurnHistory({ 
  burnHistory, 
  onSubmitWithdrawal, 
  isLoading = false 
}: BurnHistoryProps) {
  const getStatusIcon = (status: BurnHistoryItem['status']) => {
    switch (status) {
      case null:
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'SUBMITTED':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: BurnHistoryItem['status']) => {
    switch (status) {
      case null:
        return 'Not submitted';
      case 'SUBMITTED':
        return 'Submitted';
      case 'APPROVED':
        return 'Approved';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: BurnHistoryItem['status']) => {
    switch (status) {
      case null:
        return 'text-orange-600 bg-orange-50';
      case 'SUBMITTED':
        return 'text-blue-600 bg-blue-50';
      case 'APPROVED':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (burnHistory.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Send className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-dark-500 mb-2">No burn history yet</p>
        <p className="text-sm text-dark-400">
          Your unwrap transactions will appear here after burning wDingocoin
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-dark-900">Burn History</h3>
        <div className="text-sm text-dark-500">
          {burnHistory.length} transaction{burnHistory.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="space-y-3">
        {burnHistory.map((burn) => (
          <div 
            key={burn.burnIndex} 
            className="border border-dark-200 rounded-lg p-4 bg-white hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {getStatusIcon(burn.status)}
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(burn.status)}`}>
                    {getStatusText(burn.status)}
                  </span>
                </div>
                
                <div className="text-sm text-dark-600 mb-1">
                  <span className="font-medium">Amount:</span> {fromSatoshi(burn.burnAmount)} DINGO
                </div>
                
                <div className="text-xs text-dark-500 break-all">
                  <span className="font-medium">To:</span> {burn.burnDestination}
                </div>
              </div>

              {burn.status === null && (
                <button
                  onClick={() => onSubmitWithdrawal(burn.burnIndex)}
                  disabled={isLoading}
                  className="btn-primary text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="loading-spinner w-3 h-3"></div>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send className="w-3 h-3" />
                      <span>Submit for withdrawal</span>
                    </div>
                  )}
                </button>
              )}
            </div>

            {burn.status === null && (
              <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                ⚠️ This burn needs to be submitted to the authority nodes for withdrawal processing
              </div>
            )}

            {burn.status === 'SUBMITTED' && (
              <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                🕐 Withdrawal submitted and pending approval (may take up to 24 hours)
              </div>
            )}

            {burn.status === 'APPROVED' && (
              <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                ✅ Withdrawal approved and processed
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-4 text-sm text-dark-600">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium mb-1">Withdrawal Process:</p>
            <ul className="text-xs space-y-1 text-dark-500">
              <li>1. Burns appear here after blockchain confirmation</li>
              <li>2. Submit burns to authority nodes for processing</li>
              <li>3. Withdrawals are processed within 24 hours</li>
              <li>4. Each withdrawal is subject to a 1% fee</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}