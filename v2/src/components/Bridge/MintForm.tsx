import React, { useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { formatAmount, fromSatoshi, getNetworkDisplayName } from '../../utils/bridge';
import { NETWORKS } from '../../config/networks';
import { NetworkKey } from '../../config/networks';
import { NetworkConfig } from '../../types/bridge';
import { MintDepositAddress } from '../../types/bridge';
import BigInt from 'big-integer';

interface MintFormProps {
  onMint: (depositAddress: string) => Promise<void>;
  onCreateDepositAddress: () => Promise<void>;
  isLoading?: boolean;
  isCreatingDeposit?: boolean;
  network: NetworkKey;
  mintDepositAddresses: MintDepositAddress[];
  aliveNodes: number[];
}

export default function MintForm({ 
  onMint, 
  onCreateDepositAddress, 
  isLoading = false, 
  isCreatingDeposit = false,
  network, 
  mintDepositAddresses,
  aliveNodes 
}: MintFormProps) {
  const { address } = useAccount();
  const chainId = useChainId();
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const networkConfig = NETWORKS[network] as NetworkConfig;
  const isCorrectNetwork = networkConfig && chainId === networkConfig.chainId;
  const hasMintDepositAddress = mintDepositAddresses.length > 0;
  const allNodesOnline = aliveNodes.length === networkConfig.authorityNodes.length;

  const handleCreateDepositAddress = async () => {
    setError('');
    
    if (!allNodesOnline) {
      setError('All authority nodes must be online to create deposit address');
      return;
    }

    try {
      await onCreateDepositAddress();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create deposit address');
    }
  };

  const handleMint = async (depositAddress: string) => {
    setError('');
    
    try {
      await onMint(depositAddress);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Mint failed');
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {error && (
        <div className="error-message animate-shake">
          {error}
        </div>
      )}

      {!address && (
        <div className="text-center animate-pulse-glow">
          <p className="text-sm text-dark-400 mb-2">
            Connect your wallet to start wrapping
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

      {address && isCorrectNetwork && (
        <>
          {/* Step 1: Create Deposit Address */}
          {!hasMintDepositAddress && (
            <div className="animate-slide-up">
              {allNodesOnline ? (
                <div className="text-center space-y-4">
                  <p className="text-sm text-dark-600 mb-4">
                    First, create your Dingocoin deposit address to start wrapping.
                  </p>
                  {!isCreatingDeposit ? (
                    <button
                      onClick={handleCreateDepositAddress}
                      disabled={isLoading}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create Dingocoin Deposit Address
                    </button>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="loading-spinner"></div>
                      <span>Creating deposit address...</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-red-600 font-medium mb-2">
                    ⚠️ All authority nodes must be online to create deposit address
                  </p>
                  <p className="text-sm text-dark-500">
                    Currently {aliveNodes.length}/{networkConfig.authorityNodes.length} nodes online
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Show Deposit Address & Status */}
          {hasMintDepositAddress && (
            <div className="animate-slide-up space-y-4">
              {mintDepositAddresses.map((deposit) => {
                  const canMint = BigInt(deposit.mintedAmount).lt(BigInt(deposit.depositedAmount));
                  
                  const copyToClipboard = async () => {
                    try {
                      await navigator.clipboard.writeText(deposit.depositAddress);
                      setCopySuccess(true);
                      setTimeout(() => setCopySuccess(false), 2000);
                    } catch (err) {
                      console.error('Failed to copy to clipboard:', err);
                    }
                  };
                  
                  return (
                    <div key={deposit.depositAddress} className="space-y-4 border border-dark-200 rounded-lg p-4">
                      {/* Deposit Address Section */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-dark-600">
                          Your Dingocoin Deposit Address
                        </label>
                        <div className="bg-dark-50 rounded-md p-4 border relative group min-h-[3rem] flex items-center">
                          <code className="font-mono text-sm text-dark-800 break-all leading-relaxed block pr-10 w-full">
                            {deposit.depositAddress}
                          </code>
                          <button
                            onClick={copyToClipboard}
                            className={`absolute top-2 right-2 p-1 rounded transition-all duration-200 ${
                              copySuccess 
                                ? 'bg-green-100 text-green-600 opacity-100' 
                                : 'bg-white text-dark-500 hover:bg-primary-50 hover:text-primary-600 opacity-70 hover:opacity-100 md:opacity-0 md:group-hover:opacity-100'
                            } shadow-sm border`}
                            title="Copy address"
                          >
                            {copySuccess ? (
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Balance Information Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-orange-50 rounded-lg p-3 text-center">
                          <div className="text-xs text-orange-600 font-medium mb-1">Unconfirmed</div>
                          <div className="text-lg font-bold text-orange-700">
                            {fromSatoshi(deposit.unconfirmedAmount)}
                          </div>
                          <div className="text-xs text-orange-500">DINGO</div>
                        </div>
                        
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <div className="text-xs text-blue-600 font-medium mb-1">Confirmed*</div>
                          <div className="text-lg font-bold text-blue-700">
                            {fromSatoshi(deposit.depositedAmount)}
                          </div>
                          <div className="text-xs text-blue-500">DINGO</div>
                        </div>
                        
                        <div className="bg-green-50 rounded-lg p-3 text-center">
                          <div className="text-xs text-green-600 font-medium mb-1">Minted</div>
                          <div className="text-lg font-bold text-green-700">
                            {fromSatoshi(deposit.mintedAmount)}
                          </div>
                          <div className="text-xs text-green-500">wDINGO</div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="text-center">
                        {canMint ? (
                          <button
                            onClick={() => handleMint(deposit.depositAddress)}
                            disabled={isLoading}
                            className="btn-secondary px-6 py-2 disabled:opacity-50"
                          >
                            {isLoading ? 'Minting...' : 'Mint Balance'}
                          </button>
                        ) : (
                          <div className="text-sm text-dark-500">
                            ✓ All confirmed deposits have been minted
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

              <div className="text-center space-y-4">
                <div>
                  <p className="text-sm text-dark-600 mb-2">
                    Send Dingocoin to your deposit address above to start wrapping
                  </p>
                  <div className="text-xs text-dark-400">
                    Once confirmed, you can mint wDingocoin tokens
                  </div>
                </div>
                
                <div className="space-y-2 text-xs text-dark-500 bg-gray-50 rounded-lg p-4">
                  <p>* Deposits require 60 confirmations (about an hour)</p>
                  <p>* Fee: 10 Dingocoins + 1% of deposited amount</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 