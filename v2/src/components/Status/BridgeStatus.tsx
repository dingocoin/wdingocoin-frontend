import React from 'react';
import { useBridge } from '../../hooks/useBridge';
import { NETWORKS, NetworkKey } from '../../config/networks';
import { NetworkConfig } from '../../types/bridge';
import { AuthorityNode } from '../../types/bridge';
import { formatAmount } from '../../utils/bridge';

interface BridgeStatusProps {
  network: NetworkKey;
}

export default function BridgeStatus({ network }: BridgeStatusProps) {
  const {
    aliveNodes,
    stats: bridgeStats,
    isLoading,
  } = useBridge(network);

  // Debug logging for component stats
  console.log('📊 BridgeStatus received stats:', bridgeStats);

  const networkConfig = NETWORKS[network] as NetworkConfig;
  const nodeHealth = aliveNodes.length / 5 * 100;

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4 text-dark-900">
        {networkConfig?.name} Bridge Status
      </h3>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-2 text-dark-600">Loading bridge status...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Node Health */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-dark-900">Authority Node Health</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dark-600">Alive Nodes</span>
                  <span className="text-2xl font-bold text-dark-900">
                    {aliveNodes.length}/5
                  </span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        nodeHealth >= 80 ? 'bg-green-500' :
                        nodeHealth >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${nodeHealth}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-dark-400 mt-1">
                    {nodeHealth >= 80 ? 'Excellent' :
                     nodeHealth >= 60 ? 'Good' : 'Poor'} health
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-dark-600 mb-1">Consensus Required</div>
                <div className="text-2xl font-bold text-dark-900">3/5</div>
                <div className="text-xs text-dark-400">
                  {aliveNodes.length >= 3 ? '✅ Consensus possible' : '❌ Consensus not possible'}
                </div>
              </div>
            </div>
          </div>

          {/* Bridge Statistics */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-dark-900">Bridge Statistics</h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-sm text-dark-600">Total wDingocoin Supply</div>
                <div className="text-3xl font-bold text-dark-900">
                  {bridgeStats?.totalSupply ? formatAmount(bridgeStats.totalSupply) : '0'} DINGO
                </div>
                {!bridgeStats && (
                  <div className="text-xs text-dark-400 mt-1">Loading from blockchain...</div>
                )}
              </div>
            </div>
          </div>

          {/* Authority Nodes List */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-dark-900">Authority Nodes</h4>
            <div className="space-y-2">
              {networkConfig?.authorityNodes.map((node: AuthorityNode, index: number) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    aliveNodes.includes(index)
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-dark-900">
                        Node {index + 1} - {node.location}
                      </div>
                      <div className="text-sm text-dark-600">
                        {node.walletAddress.slice(0, 8)}...{node.walletAddress.slice(-6)}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      aliveNodes.includes(index)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {aliveNodes.includes(index) ? 'Online' : 'Offline'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 