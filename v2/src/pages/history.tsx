import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import ConnectButton from "../components/Wallet/ConnectButton";
import NetworkSelector from "../components/Bridge/NetworkSelector";
import TransactionHistory from "../components/Bridge/TransactionHistory";
import { useBridge } from "../hooks/useBridge";
import { NetworkKey } from "../config/networks";

export default function HistoryPage() {
  const { address } = useAccount();
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkKey>('bsc');

  const {
    mintDepositAddresses,
    burnHistory,
    isLoading,
  } = useBridge(selectedNetwork);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-dark-900 mb-4">Transaction History</h1>
        <p className="text-dark-600">
          View your wrap and unwrap transaction history across all supported networks
        </p>
      </div>

      <div className="mb-8 flex justify-center">
        <ConnectButton />
      </div>

      {address && (
        <>
          <NetworkSelector
            selectedNetwork={selectedNetwork}
            onNetworkChange={setSelectedNetwork}
          />

          <div className="mt-8">
            <TransactionHistory
              mintDepositAddresses={mintDepositAddresses}
              burnHistory={burnHistory}
              isLoading={isLoading}
              network={selectedNetwork}
            />
          </div>
        </>
      )}

      {!address && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-dark-900 mb-2">Connect Your Wallet</h3>
          <p className="text-dark-600">
            Connect your wallet to view your transaction history
          </p>
        </div>
      )}
    </div>
  );
}