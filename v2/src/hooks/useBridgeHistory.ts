import { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { NetworkKey, NETWORKS } from '../config/networks';
import { MintDepositAddress, BurnHistoryItem, NetworkConfig } from '../types/bridge';
import { 
  post, 
  getAliveNodes,
  queryDepositAddressWithConsensus,
  getConsensusAuthorityLink
} from '../utils/bridge';

/**
 * Specialized hook for loading bridge history data once without polling.
 * Optimized for the history page to avoid unnecessary re-fetching.
 */
export const useBridgeHistory = (selectedNetwork: NetworkKey) => {
  const { address, isConnected } = useAccount();
  const network = NETWORKS[selectedNetwork] as NetworkConfig;
  
  // State
  const [aliveNodes, setAliveNodes] = useState<number[]>([]);
  const [goodNodes, setGoodNodes] = useState<number[]>([]);
  const [mintDepositAddresses, setMintDepositAddresses] = useState<MintDepositAddress[]>([]);
  const [burnHistory, setBurnHistory] = useState<BurnHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Track if data has been loaded for this address/network combination
  const loadedRef = useRef<Set<string>>(new Set());
  const getLoadKey = (addr: string, net: NetworkKey) => `${addr}-${net}`;

  // Load alive nodes once
  useEffect(() => {
    const loadAliveNodes = async () => {
      try {
        const nodes = await getAliveNodes(network);
        setAliveNodes(nodes);
      } catch (err) {
        console.error('Failed to load alive nodes:', err);
        setError('Failed to connect to bridge nodes');
      }
    };

    loadAliveNodes();
  }, [network]);

  // Load transaction history once per address/network combination
  useEffect(() => {
    if (!address || !isConnected || aliveNodes.length === 0) {
      setMintDepositAddresses([]);
      setBurnHistory([]);
      setError(null);
      return;
    }

    const loadKey = getLoadKey(address, selectedNetwork);
    
    // Skip loading if we already loaded data for this combination
    if (loadedRef.current.has(loadKey)) {
      return;
    }

    const loadHistoryData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch mint deposit addresses using consensus
        try {
          const consensusResult = await queryDepositAddressWithConsensus(network, address, aliveNodes);
          
          if (consensusResult.hasConsensus && consensusResult.depositAddress) {
            // Update good nodes for future queries
            setGoodNodes(consensusResult.goodNodes);
            
            // Get the full deposit data from one of the good nodes
            const goodNodeLink = getConsensusAuthorityLink(network, consensusResult.goodNodes);
            const mintResponse = await post(`${goodNodeLink}/queryMintBalance`, {
              mintAddress: address,
            });
            
            if (mintResponse.data) {
              setMintDepositAddresses([mintResponse.data]);
            } else {
              setMintDepositAddresses([]);
            }
          } else if (consensusResult.consensusCount > 0) {
            // Partial consensus - warn but still use the best result
            console.warn(`Insufficient consensus for deposit address. Only ${consensusResult.consensusCount} out of ${network.authorityThreshold} required nodes agree.`);
            setMintDepositAddresses([]);
            setError(`Warning: Only ${consensusResult.consensusCount} nodes recognize the deposit address. Consensus threshold is ${network.authorityThreshold}.`);
          } else {
            // No deposit address found
            setMintDepositAddresses([]);
            setGoodNodes([]);
          }
        } catch (err) {
          console.error('Failed to query deposit address with consensus:', err);
          setMintDepositAddresses([]);
          setGoodNodes([]);
        }

        // Fetch burn history - use good nodes if available, otherwise all alive nodes
        const nodesToQuery = goodNodes.length >= network.authorityThreshold ? goodNodes : aliveNodes;
        if (nodesToQuery.length > 0) {
          const burnHistories = await Promise.allSettled(
            nodesToQuery.map((i) => 
              post(`https://${network.authorityNodes[i].location}:${network.authorityNodes[i].port}/queryBurnHistory`, {
                burnAddress: address,
              })
            )
          );
          
          const successfulBurnHistories = burnHistories
            .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
            .map(result => result.value.data.burnHistory)
            .filter(history => history && history.length > 0);

          if (successfulBurnHistories.length > 0) {
            // Use the same logic as the main bridge hook for consensus
            const maxLength = Math.max(...successfulBurnHistories.map(history => history.length));
            const consensusBurnHistory: BurnHistoryItem[] = [];

            for (let i = 0; i < maxLength; i++) {
              // Get the burn structure from the first available node
              const baseBurn = successfulBurnHistories.find(history => history.length > i)?.[i];
              if (!baseBurn) continue;

              // Determine consensus status across all nodes using majority-based consensus
              let consensusStatus: BurnHistoryItem['status'] = null;

              // Count status votes from responding nodes
              const statusCounts = {
                'not_submitted': 0,
                'SUBMITTED': 0,
                'APPROVED': 0
              };

              successfulBurnHistories.forEach(history => {
                const status = history[i]?.status;
                if (status !== undefined) {
                  if (status === null) {
                    statusCounts['not_submitted']++;
                  } else if (status === 'SUBMITTED') {
                    statusCounts['SUBMITTED']++;
                  } else if (status === 'APPROVED') {
                    statusCounts['APPROVED']++;
                  }
                }
              });

              const totalResponses = successfulBurnHistories.length;
              const majority = Math.ceil(totalResponses / 2);

              // Determine consensus based on majority vote
              if (statusCounts['APPROVED'] >= majority) {
                consensusStatus = 'APPROVED';
              } else if (statusCounts['SUBMITTED'] >= majority) {
                consensusStatus = 'SUBMITTED';
              } else if (statusCounts['not_submitted'] >= majority) {
                consensusStatus = null;
              } else {
                // No clear majority - use the highest priority status found
                if (statusCounts['APPROVED'] > 0) {
                  consensusStatus = 'APPROVED';
                } else if (statusCounts['SUBMITTED'] > 0) {
                  consensusStatus = 'SUBMITTED';
                } else {
                  consensusStatus = null;
                }
              }

              consensusBurnHistory.push({
                burnIndex: i,
                burnDestination: baseBurn.burnDestination,
                burnAmount: baseBurn.burnAmount,
                status: consensusStatus
              });
            }
            
            setBurnHistory(consensusBurnHistory.reverse());
          } else {
            setBurnHistory([]);
          }
        }

        // Mark this combination as loaded
        loadedRef.current.add(loadKey);

      } catch (err) {
        console.error('Failed to load history data:', err);
        setError('Failed to load transaction history');
      } finally {
        setIsLoading(false);
      }
    };

    loadHistoryData();
  }, [address, isConnected, aliveNodes, network, selectedNetwork, goodNodes]);

  // Clear loaded cache when address changes to a different address
  useEffect(() => {
    if (address) {
      // Clear cache for other addresses, keep current one
      const currentKey = getLoadKey(address, selectedNetwork);
      const newCache = new Set<string>();
      if (loadedRef.current.has(currentKey)) {
        newCache.add(currentKey);
      }
      loadedRef.current = newCache;
    } else {
      // Clear all cache when disconnected
      loadedRef.current.clear();
    }
  }, [address, selectedNetwork]);

  // Provide manual refresh function
  const refreshHistory = () => {
    if (address) {
      const loadKey = getLoadKey(address, selectedNetwork);
      loadedRef.current.delete(loadKey);
      
      // Clear current data to show loading state
      setMintDepositAddresses([]);
      setBurnHistory([]);
      setError(null);
    }
  };

  return {
    aliveNodes,
    mintDepositAddresses,
    burnHistory,
    isLoading,
    error,
    network,
    refreshHistory,
  };
};