import React, { useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { parseAmount, formatAmount, calculateFee, getNetworkDisplayName, isValidDingocoinAddress } from '../../utils/bridge';
import { NETWORKS } from '../../config/networks';
import { NetworkKey } from '../../config/networks';
import { BurnHistoryItem } from '../../types/bridge';
import BurnHistory from './BurnHistory';

interface BurnFormProps {
  onBurn: (amount: string, destinationAddress: string) => Promise<void>;
  onSubmitWithdrawal: (burnIndex: number) => Promise<void>;
  burnHistory: BurnHistoryItem[];
  isLoading?: boolean;
  network: NetworkKey;
}

export default function BurnForm({ onBurn, onSubmitWithdrawal, burnHistory, isLoading = false, network }: BurnFormProps) {
  const { address } = useAccount();
  const chainId = useChainId();
  const [amount, setAmount] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [error, setError] = useState('');
  const [addressValidation, setAddressValidation] = useState<{isValid: boolean, message: string}>({isValid: false, message: ''});

  const networkConfig = NETWORKS[network];
  const isCorrectNetwork = networkConfig && chainId === networkConfig.chainId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!address) {
      setError('Please connect your wallet first');
      return;
    }

    if (!isCorrectNetwork) {
      setError(`Please switch to ${getNetworkDisplayName(network)}`);
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!destinationAddress) {
      setError('Please enter a destination address');
      return;
    }

    if (!isValidDingocoinAddress(destinationAddress)) {
      setError('Please enter a valid Dingocoin address');
      return;
    }

    try {
      await onBurn(amount, destinationAddress);
      setAmount('');
      setDestinationAddress('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Burn failed');
    }
  };

  // Real-time address validation
  const handleAddressChange = (value: string) => {
    setDestinationAddress(value);
    if (value.trim() === '') {
      setAddressValidation({isValid: false, message: ''});
    } else if (isValidDingocoinAddress(value)) {
      setAddressValidation({isValid: true, message: 'Valid Dingocoin address'});
    } else {
      setAddressValidation({isValid: false, message: 'Invalid Dingocoin address format'});
    }
  };

  // Calculate fees and amounts
  const numericAmount = amount ? parseFloat(amount) : 0;
  const fee = numericAmount > 0 ? calculateFee(amount) : '0';
  const numericFee = parseFloat(fee);
  const youWillReceive = numericAmount > numericFee ? numericAmount - numericFee : 0;

  return (
    <div className="animate-fade-in">
      <form onSubmit={handleSubmit} className="form-container space-y-6">
        <div className="animate-slide-left">
          <label htmlFor="burn-amount" className="block text-sm font-medium text-dark-600 mb-3 transition-colors duration-200">
            Amount to Unwrap (wDINGO)
          </label>
          <input
            type="number"
            id="burn-amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            step="0.00000001"
            min="0"
            className="input-field"
            disabled={isLoading}
          />
        </div>

        <div className="animate-slide-right">
          <label htmlFor="burn-destination" className="block text-sm font-medium text-dark-600 mb-3 transition-colors duration-200">
            Destination Address (Dingocoin)
          </label>
          <input
            type="text"
            id="burn-destination"
            value={destinationAddress}
            onChange={(e) => handleAddressChange(e.target.value)}
            placeholder="DQBx7G4aozdqYFCv2dU4kacaEcPzwg8dkZ"
            className={`input-field ${
              destinationAddress && !addressValidation.isValid ? 'border-red-500 focus:border-red-500' : 
              destinationAddress && addressValidation.isValid ? 'border-green-500 focus:border-green-500' : ''
            }`}
            disabled={isLoading}
          />
          {destinationAddress && (
            <p className={`text-xs mt-2 animate-slide-up ${
              addressValidation.isValid ? 'text-green-600' : 'text-red-600'
            }`}>
              {addressValidation.isValid ? '✓' : '⚠️'} {addressValidation.message}
            </p>
          )}
          {!destinationAddress && (
            <p className="text-xs text-orange-600 mt-2 animate-slide-up">
              ⚠️ Enter your native Dingocoin address (not EVM address)
            </p>
          )}
        </div>

        {numericAmount > 0 && (
          <div className="amount-display animate-bounce-in">
            <div className="flex justify-between text-sm transition-colors duration-200 hover:text-primary-600">
              <span className="text-dark-600">Amount:</span>
              <span className="text-dark-900 font-medium">{numericAmount.toFixed(8)} wDINGO</span>
            </div>
            <div className="flex justify-between text-sm transition-colors duration-200 hover:text-red-600">
              <span className="text-dark-600">Fee:</span>
              <span className="text-dark-900 font-medium">-{numericFee.toFixed(8)} wDINGO</span>
            </div>
            <hr className="border-dark-200" />
            <div className="flex justify-between text-sm font-bold transition-colors duration-200">
              <span className="text-dark-700">You will receive:</span>
              <span className={`${youWillReceive > 0 ? 'text-secondary-600 text-gradient' : 'text-red-600'}`}>
                {youWillReceive > 0 ? youWillReceive.toFixed(8) : '0.00000000'} DINGO
              </span>
            </div>
            {youWillReceive <= 0 && (
              <p className="text-xs text-red-600 mt-2 animate-slide-up">
                ⚠️ Amount too small - fee exceeds input amount
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="error-message animate-shake">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !address || !isCorrectNetwork || !addressValidation.isValid || youWillReceive <= 0}
          className="w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none group"
        >
          <div className="flex items-center justify-center space-x-2">
            {isLoading && (
              <div className="loading-spinner"></div>
            )}
            <span className="transition-all duration-200 group-hover:text-white">
              {isLoading ? 'Processing...' : 'Unwrap wDingocoin'}
            </span>
          </div>
        </button>

        {!address && (
          <div className="text-center animate-pulse-glow">
            <p className="text-sm text-dark-400 mb-2">
              Connect your wallet to start unwrapping
            </p>
            <div className="text-xs text-dark-300">
              🔗 Wallet connection required
            </div>
          </div>
        )}

        {address && !isCorrectNetwork && (
          <div className="text-center animate-bounce-in">
            <p className="text-sm text-orange-600 mb-2 font-medium">
              ⚠️ Wrong Network
            </p>
            <p className="text-xs text-dark-400">
                          Please switch to {getNetworkDisplayName(network)} to continue
          </p>
        </div>
      )}
    </form>

      {/* Burn History Section */}
      {address && isCorrectNetwork && (
        <div className="mt-8">
          <BurnHistory
            burnHistory={burnHistory}
            onSubmitWithdrawal={onSubmitWithdrawal}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
} 