import { useState, useEffect, useCallback } from 'react';
import { useAccount, useChainId, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther, encodeFunctionData } from 'viem';
import { NetworkKey, NETWORKS } from '../config/networks';
import { MintDepositAddress, BurnHistoryItem, BridgeStats } from '../types/bridge';
import { 
  post, 
  getAliveNodes, 
  getRandomAuthorityLink, 
  getStableAuthorityLink,
  isValidDingocoinAddress,
  parseAmount,
  calculateFee,
  queryDepositAddressWithConsensus,
  getConsensusAuthorityLink
} from '../utils/bridge';

// Contract ABI for wDingocoin token
const CONTRACT_ABI = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "string", name: "destination", type: "string" },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "depositAddress", type: "string" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint8[]", name: "signV", type: "uint8[]" },
      { internalType: "bytes32[]", name: "signR", type: "bytes32[]" },
      { internalType: "bytes32[]", name: "signS", type: "bytes32[]" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const useBridge = (selectedNetwork: NetworkKey) => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const network = NETWORKS[selectedNetwork];
  
  // State
  const [aliveNodes, setAliveNodes] = useState<number[]>([]);
  const [goodNodes, setGoodNodes] = useState<number[]>([]);
  const [mintDepositAddresses, setMintDepositAddresses] = useState<MintDepositAddress[]>([]);
  const [burnHistory, setBurnHistory] = useState<BurnHistoryItem[]>([]);
  const [stats, setStats] = useState<BridgeStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Contract reads
  const { data: wDingocoinBalance } = useReadContract({
    address: network.contractAddress as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Contract writes
  const { writeContract: writeBurnContract, data: burnData } = useWriteContract();

  const { writeContract: writeMintContract, data: mintData } = useWriteContract();

  // Transaction status
  const { isLoading: isBurnLoading } = useWaitForTransactionReceipt({
    hash: burnData,
  });

  const { isLoading: isMintLoading } = useWaitForTransactionReceipt({
    hash: mintData,
  });

  // Initialize alive nodes
  useEffect(() => {
    const initAliveNodes = async () => {
      try {
        const alive = await getAliveNodes(network);
        setAliveNodes(alive);
      } catch (err) {
        console.error('Failed to initialize alive nodes:', err);
      }
    };

    if (network) {
      initAliveNodes();
    }
  }, [network]);

  // Refresh data after successful mint transaction
  useEffect(() => {
    if (mintData) {
      // Delay refresh to allow blockchain state to update
      const timer = setTimeout(async () => {
        try {
          const consensusResult = await queryDepositAddressWithConsensus(network, address!, aliveNodes);
          
          if (consensusResult.hasConsensus && consensusResult.depositAddress) {
            setGoodNodes(consensusResult.goodNodes);
            const goodNodeLink = getConsensusAuthorityLink(network, consensusResult.goodNodes);
            const mintResponse = await post(`${goodNodeLink}/queryMintBalance`, {
              mintAddress: address,
            });
            
            if (mintResponse.data) {
              setMintDepositAddresses([mintResponse.data]);
            }
          }
        } catch (err) {
          console.error('Failed to refresh data after mint:', err);
        }
      }, 3000); // Wait 3 seconds for blockchain to update

      return () => clearTimeout(timer);
    }
  }, [mintData, network, address, aliveNodes]);

  // Refresh data when wallet changes
  useEffect(() => {
    if (!address || !isConnected) {
      setMintDepositAddresses([]);
      setBurnHistory([]);
      setStats(null);
      return;
    }

    const refreshData = async () => {
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
            // Use the same logic as legacy controllers: take structure from first node, determine consensus status
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
                // Majority shows approved - mark as approved
                consensusStatus = 'APPROVED';
              } else if (statusCounts['SUBMITTED'] >= majority) {
                // Majority shows submitted - mark as submitted
                consensusStatus = 'SUBMITTED';
              } else if (statusCounts['not_submitted'] >= majority) {
                // Majority shows not submitted - mark as not submitted
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

        // Fetch stats - prefer good nodes if available
        try {
          const statsLink = goodNodes.length > 0 ? getConsensusAuthorityLink(network, goodNodes) : getStableAuthorityLink(network);
          const statsResponse = await post(`${statsLink}/stats`, {});
          setStats(statsResponse.data);
        } catch (err) {
          console.error('Failed to fetch stats:', err);
          // Don't set error for stats failure as it's not critical
        }

      } catch (err) {
        console.error('Failed to refresh data:', err);
        setError('Failed to load bridge data');
      } finally {
        setIsLoading(false);
      }
    };

    refreshData();
    
    // Set up polling
    const interval = setInterval(refreshData, 15000);
    return () => clearInterval(interval);
  }, [address, isConnected, aliveNodes, network]);

  // Check if connected to correct network
  const isCorrectNetwork = chainId === network.chainId;

  // Create deposit address
  const createDepositAddress = useCallback(async () => {
    if (aliveNodes.length < network.authorityNodes.length) {
      setError('All authority nodes must be online to create deposit address');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const generateResponses = await Promise.all(
        network.authorityNodes.map((node, i) => 
          post(`https://${node.location}:${node.port}/generateDepositAddress`, {
            mintAddress: address,
          })
        )
      );

      const registerResponses = await Promise.all(
        network.authorityNodes.map((node, i) =>
          post(`https://${node.location}:${node.port}/registerMintDepositAddress`, {
            mintAddress: address,
            generateDepositAddressResponses: generateResponses,
          })
        )
      );

      // Verify consensus
      const firstAddress = registerResponses[0].data.depositAddress;
      if (!registerResponses.every(response => response.data.depositAddress === firstAddress)) {
        throw new Error('Consensus failure on deposit address');
      }

      // Refresh data
      const refreshData = async () => {
        const mintResponse = await post(`${getRandomAuthorityLink(network)}/queryMintBalance`, {
          mintAddress: address,
        });
        
        if (mintResponse.data) {
          setMintDepositAddresses([mintResponse.data]);
        }
      };

      await refreshData();

    } catch (err) {
      console.error('Failed to create deposit address:', err);
      setError('Failed to create deposit address');
    } finally {
      setIsLoading(false);
    }
  }, [address, aliveNodes, network]);

  // Mint tokens
  const mintTokens = useCallback(async (depositAddress: string) => {
    if (!address || !isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('Starting mint process for deposit address:', depositAddress);
      console.log('Connected wallet address:', address);
      console.log('Is wallet connected:', isConnected);

      // Use good nodes if available, otherwise use all authority nodes
      const nodesToQuery = goodNodes.length >= network.authorityThreshold ? goodNodes : aliveNodes;
      
      if (nodesToQuery.length === 0) {
        throw new Error('No authority nodes available for minting');
      }

      const mintTransactionInfos = Array(network.authorityNodes.length).fill(undefined);
      await Promise.all(
        nodesToQuery.map((nodeIndex) => {
          const node = network.authorityNodes[nodeIndex];
          return post(`https://${node.location}:${node.port}/createMintTransaction`, {
            mintAddress: address,
          })
          .then((r) => {
            mintTransactionInfos[nodeIndex] = r.data;
          })
          .catch((err) => {
            console.error(`Node ${nodeIndex} failed to create mint transaction:`, err);
            // Node failed, leave as undefined
          });
        })
      );

      const availableInfos = mintTransactionInfos.filter(info => info !== undefined);
      
      if (availableInfos.length < network.authorityThreshold) {
        throw new Error(`Failed to collect sufficient signatures for minting. Got ${availableInfos.length}, need ${network.authorityThreshold}`);
      }

      // Verify consensus
      const firstInfo = availableInfos[0];
      if (!availableInfos.every(info => 
        info.mintAddress === firstInfo.mintAddress &&
        info.nonce === firstInfo.nonce &&
        info.depositAddress === depositAddress &&
        info.mintAmount === firstInfo.mintAmount
      )) {
        throw new Error('Consensus failure on mint transaction');
      }

      const mintAmount = firstInfo.mintAmount;
      
      // Convert to BigInt if it's a string
      const mintAmountBigInt = typeof mintAmount === 'string' ? BigInt(mintAmount) : mintAmount;
      
      // Format signatures properly for Viem (bytes32 for R/S, uint8 for V)
      const signV = mintTransactionInfos.map(info => info?.onContractVerification?.v || 0);
      const signR = mintTransactionInfos.map(info => info?.onContractVerification?.r || '0x0000000000000000000000000000000000000000000000000000000000000000');
      const signS = mintTransactionInfos.map(info => info?.onContractVerification?.s || '0x0000000000000000000000000000000000000000000000000000000000000000');

      // Debug signature structure
      console.log('First transaction info:', mintTransactionInfos.find(info => info !== undefined));
      console.log('Signature arrays:', { signV, signR, signS });

      console.log('Mint transaction data:', {
        depositAddress,
        mintAmount,
        mintAmountBigInt,
        signV,
        signR,
        signS,
        contractAddress: network.contractAddress
      });

      // Execute mint transaction
      // Check if we're on the correct network
      if (chainId !== network.chainId) {
        throw new Error(`Wrong network. Please switch to ${network.name} (Chain ID: ${network.chainId})`);
      }

      console.log('About to call writeMintContract with:', {
        address: network.contractAddress,
        functionName: 'mint',
        args: [depositAddress, mintAmountBigInt, signV, signR, signS],
        chainId: network.chainId,
        currentChainId: chainId
      });

      try {
        const result = await writeMintContract({
          address: network.contractAddress as `0x${string}`,
          abi: CONTRACT_ABI,
          functionName: 'mint',
          args: [depositAddress, mintAmountBigInt, signV, signR, signS],
        });

        console.log('writeMintContract result:', result);
        console.log('writeMintContract completed successfully');
        console.log('Current mintData from hook:', mintData);
        
        // Check if transaction hash is available in the hook data
        if (mintData) {
          console.log('Transaction hash available:', mintData);
        } else {
          console.warn('No transaction hash in mintData yet');
        }
        
        // If we get here without a popup, something is wrong with Wagmi
        if (result === undefined) {
          console.log('writeMintContract returned undefined (normal for Wagmi v2), checking if transaction initiated...');
          
          // Wait a bit for the wallet popup to appear
          await new Promise(resolve => setTimeout(resolve, 500));
          
          if (!mintData) {
            console.warn('No transaction hash after 500ms - Wagmi may not be configured correctly');
            // Don't force fallback immediately, let's see if it works
          }
        }
      } catch (contractError) {
        console.error('writeMintContract failed:', contractError);
        
        // Fallback to legacy method if Wagmi fails
        console.log('Attempting fallback to legacy ethereum.request method...');
        
        if (typeof window !== 'undefined' && window.ethereum) {
          try {
            // Use Viem to encode the transaction data
            const encodedData = encodeFunctionData({
              abi: CONTRACT_ABI,
              functionName: 'mint',
              args: [depositAddress, mintAmountBigInt, signV, signR, signS],
            });
            
            console.log('Encoded transaction data:', encodedData);
            
            const txResult = await window.ethereum.request({
              method: 'eth_sendTransaction',
              params: [{
                from: address,
                to: network.contractAddress,
                data: encodedData,
              }],
            });
            
            console.log('Legacy transaction result:', txResult);
            return; // Success with fallback
          } catch (legacyError) {
            console.error('Legacy fallback also failed:', legacyError);
          }
        }
        
        throw new Error(`Contract call failed: ${contractError instanceof Error ? contractError.message : 'Unknown error'}`);
      }

      // Wait for transaction confirmation before refreshing
      console.log('Mint transaction submitted, waiting for confirmation...');

    } catch (err) {
      console.error('Failed to mint tokens:', err);
      setError(err instanceof Error ? err.message : 'Failed to mint tokens');
    } finally {
      setIsLoading(false);
    }
  }, [address, isConnected, network, writeMintContract, goodNodes, aliveNodes]);

  // Burn tokens
  const burnTokens = useCallback(async (amount: string, destinationAddress: string) => {
    if (!isValidDingocoinAddress(destinationAddress)) {
      setError('Invalid Dingocoin address');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const parsedAmount = parseAmount(amount);
      
      await writeBurnContract({
        address: network.contractAddress as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'burn',
        args: [parsedAmount, destinationAddress],
      });

    } catch (err) {
      console.error('Failed to burn tokens:', err);
      setError('Failed to burn tokens');
    } finally {
      setIsLoading(false);
    }
  }, [network, writeBurnContract]);

  // Submit withdrawal
  const submitWithdrawal = useCallback(async (burnIndex: number) => {
    try {
      setIsLoading(true);
      setError(null);

      await Promise.all(
        network.authorityNodes.map(node =>
          post(`https://${node.location}:${node.port}/submitWithdrawal`, {
            burnAddress: address,
            burnIndex: burnIndex,
          })
        )
      );

      // Refresh burn history
      const burnHistories = await Promise.all(
        aliveNodes.map((i) => 
          post(`https://${network.authorityNodes[i].location}:${network.authorityNodes[i].port}/queryBurnHistory`, {
            burnAddress: address,
          })
        )
      );
      
      const burnHistory = burnHistories
        .map(response => response.data.burnHistory)
        .flat()
        .reverse();
      
      setBurnHistory(burnHistory);

    } catch (err) {
      console.error('Failed to submit withdrawal:', err);
      setError('Failed to submit withdrawal');
    } finally {
      setIsLoading(false);
    }
  }, [address, aliveNodes, network]);

  return {
    aliveNodes,
    mintDepositAddresses,
    burnHistory,
    stats,
    isLoading: isLoading || isBurnLoading || isMintLoading,
    error,
    wDingocoinBalance: wDingocoinBalance ? formatEther(wDingocoinBalance) : '0',
    createDepositAddress,
    mintTokens,
    burnTokens,
    submitWithdrawal,
    network,
    isCorrectNetwork,
  };
}; 