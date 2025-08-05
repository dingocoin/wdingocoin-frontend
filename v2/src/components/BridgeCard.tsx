import React from 'react';
import { ArrowRight, ArrowLeft, Coins, Wallet } from 'lucide-react';
import { BridgeDirection } from '../types/bridge';

interface BridgeCardProps {
  direction: BridgeDirection;
  amount: string;
  onAmountChange: (amount: string) => void;
  destinationAddress?: string;
  onDestinationChange?: (address: string) => void;
  onAction: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  balance?: string;
  fee?: string;
}

const BridgeCard: React.FC<BridgeCardProps> = ({
  direction,
  amount,
  onAmountChange,
  destinationAddress,
  onDestinationChange,
  onAction,
  isLoading = false,
  isDisabled = false,
  balance,
  fee,
}) => {
  const isWrap = direction === 'wrap';

  return (
    <div className="card-interactive animate-fade-in">
      <div className="flex items-center justify-between mb-6 animate-slide-down">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 animate-float ${
            isWrap ? 'bg-primary-100 text-primary-600 hover:bg-primary-200' : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
          }`}>
            {isWrap ? <ArrowRight className="w-6 h-6 transition-transform duration-200 hover:translate-x-1" /> : <ArrowLeft className="w-6 h-6 transition-transform duration-200 hover:-translate-x-1" />}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-dark-900 transition-colors duration-200 hover:text-primary-600">
              {isWrap ? 'Wrap Dingocoin' : 'Unwrap wDingocoin'}
            </h3>
            <p className="text-sm text-dark-500 transition-colors duration-200">
              {isWrap ? 'Convert Dingocoin to wDingocoin' : 'Convert wDingocoin to Dingocoin'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Amount Input */}
        <div className="animate-slide-right">
          <label className="block text-sm font-medium text-dark-700 mb-3 transition-colors duration-200">
            Amount to {isWrap ? 'wrap' : 'unwrap'}
          </label>
          <div className="relative group">
            <input
              type="text"
              value={amount}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d{0,8}$/.test(value)) {
                  onAmountChange(value);
                }
              }}
              placeholder="0.00"
              className="input-field pr-12 group-hover:shadow-md"
              disabled={isDisabled}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Coins className="w-5 h-5 text-dark-400 transition-colors duration-200 group-hover:text-primary-500" />
            </div>
          </div>
          {balance && (
            <p className="text-xs text-dark-500 mt-2 animate-slide-up transition-colors duration-200 hover:text-primary-600">
              💰 Balance: {balance} {isWrap ? 'Dingocoin' : 'wDingocoin'}
            </p>
          )}
        </div>

        {/* Destination Address (for unwrap) */}
        {!isWrap && onDestinationChange && (
          <div className="animate-slide-left">
            <label className="block text-sm font-medium text-dark-700 mb-3 transition-colors duration-200">
              Dingocoin Destination Address
            </label>
            <div className="relative group">
              <input
                type="text"
                value={destinationAddress || ''}
                onChange={(e) => onDestinationChange(e.target.value)}
                placeholder="DQBx7G4aozdqYFCv2dU4kacaEcPzwg8dkZ"
                className="input-field pr-12 group-hover:shadow-md"
                disabled={isDisabled}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Wallet className="w-5 h-5 text-dark-400 transition-colors duration-200 group-hover:text-secondary-500" />
              </div>
            </div>
            <p className="text-xs text-orange-600 mt-2 animate-slide-up">
              ⚠️ Enter your native Dingocoin address
            </p>
          </div>
        )}

        {/* Fee Information */}
        {fee && parseFloat(fee) > 0 && (
          <div className="amount-display animate-bounce-in">
            <div className="flex justify-between text-sm transition-colors duration-200 hover:text-primary-600">
              <span className="text-dark-600">Fee:</span>
              <span className="text-dark-900 font-medium">{fee} Dingocoin</span>
            </div>
            <p className="text-xs text-dark-500 mt-1 transition-opacity duration-200 hover:opacity-80">
              💡 Base fee: 10 Dingocoin + 1% of amount
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onAction}
          disabled={isDisabled || isLoading || !amount || parseFloat(amount) <= 0}
          className={`w-full ${isWrap ? 'btn-primary' : 'btn-secondary'} disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none group animate-slide-up`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="loading-spinner"></div>
              <span className="transition-all duration-200">Processing...</span>
            </div>
          ) : (
            <span className="transition-all duration-200 group-hover:text-white">
              {isWrap ? '🚀' : '🔓'} {`${isWrap ? 'Wrap' : 'Unwrap'} ${amount || '0'} ${isWrap ? 'Dingocoin' : 'wDingocoin'}`}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default BridgeCard; 