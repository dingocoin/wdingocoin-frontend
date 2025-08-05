import React from 'react';
import { useSwitchChain } from 'wagmi';
import { NETWORKS, NetworkKey } from '../../config/networks';

interface NetworkSelectorProps {
  selectedNetwork: NetworkKey;
  onNetworkChange: (network: NetworkKey) => void;
}

export default function NetworkSelector({ selectedNetwork, onNetworkChange }: NetworkSelectorProps) {
  const { switchChain } = useSwitchChain();

  const handleNetworkChange = async (network: NetworkKey) => {
    const networkConfig = NETWORKS[network];
    if (networkConfig) {
      try {
        await switchChain({ chainId: networkConfig.chainId });
        onNetworkChange(network);
      } catch (error) {
        console.error('Failed to switch network:', error);
      }
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-dark-600 mb-2">
        Select Network
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Object.entries(NETWORKS).map(([key, network]) => (
          <button
            key={key}
            onClick={() => handleNetworkChange(key as NetworkKey)}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedNetwork === key
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-25'
            }`}
          >
            <div className="text-sm font-medium">{network.name}</div>
            <div className="text-xs text-dark-400">Chain ID: {network.chainId}</div>
          </button>
        ))}
      </div>
    </div>
  );
} 