import BigInt from 'big-integer';
import bs58 from 'bs58';
import crypto from 'crypto';
import { NetworkConfig, MintDepositAddress, BurnHistoryItem } from '../types/bridge';

const DECIMALS = 8;

export const toSatoshi = (x: number): string => {
  // Handle edge cases
  if (isNaN(x) || !isFinite(x)) {
    return '0';
  }
  
  // Convert to fixed decimal string to avoid scientific notation
  let xs = x.toFixed(DECIMALS);
  
  // Remove the decimal point by concatenating integer and fractional parts
  const decimalIndex = xs.indexOf('.');
  if (decimalIndex !== -1) {
    xs = xs.substr(0, decimalIndex) + xs.slice(decimalIndex + 1);
  }
  
  // Remove leading zeros but keep at least one digit
  xs = xs.replace(/^0+/, '') || '0';
  
  return xs;
};

export const fromSatoshi = (xs: string): string => {
  let integer = xs.slice(0, xs.length - DECIMALS);
  if (integer === "") {
    integer = "0";
  }

  const fractional = xs.slice(xs.length - DECIMALS).padStart(DECIMALS, "0");
  if (BigInt(fractional).geq(BigInt("50000000"))) {
    integer = BigInt(integer).add(BigInt("1")).toString();
  }

  return integer === "" ? "0" : numberWithCommas(integer);
};

export const numberWithCommas = (x: string): string => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const sha256 = (data: string | Buffer): Buffer => {
  return crypto.createHash("sha256").update(data).digest();
};

export const isValidDingocoinAddress = (address: string): boolean => {
  try {
    const raw = bs58.decode(address);
    if (raw.length !== 25) {
      return false;
    }
    if (raw[0] !== 0x16 && raw[0] !== 0x1e) {
      return false;
    }
    const checksum = sha256(sha256(Buffer.from(raw.slice(0, 21))));
    return Buffer.compare(Buffer.from(raw.slice(21, 25)), checksum.slice(0, 4)) === 0;
  } catch {
    return false;
  }
};

export const authorityLink = (node: { location: string; port: number }): string => {
  return `https://${node.location}:${node.port}`;
};

export const post = async (link: string, data: any = {}): Promise<any> => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), 5000);
  
  const response = await fetch(link, {
    method: 'POST',
    signal: controller.signal,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

export const getAliveNodes = async (network: NetworkConfig): Promise<number[]> => {
  const alive: number[] = [];
  
  for (const i in network.authorityNodes) {
    try {
      await post(`${authorityLink(network.authorityNodes[i])}/ping`);
      alive.push(parseInt(i));
    } catch {
      // Node is down, skip
    }
  }
  
  return alive;
};

export const getRandomAuthorityLink = (network: NetworkConfig, aliveNodes?: number[]): string => {
  const nodes = aliveNodes && aliveNodes.length > 0 ? aliveNodes : [0, 1, 2, 3, 4];
  const nodeIndex = nodes[Math.floor(Math.random() * nodes.length)];
  const node = network.authorityNodes[nodeIndex];
  return authorityLink(node);
};

export const getStableAuthorityLink = (network: NetworkConfig): string => {
  const node = network.authorityNodes[4]; // Use the last node as stable
  return authorityLink(node);
};

export const formatAmount = (amount: string, decimals: number = DECIMALS): string => {
  // Handle empty or invalid input
  if (!amount || amount === '') {
    return '0';
  }
  
  // Convert scientific notation to decimal string
  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount)) {
    return '0';
  }
  
  // If the amount is already in satoshi format (integer string), use fromSatoshi
  if (amount.indexOf('.') === -1 && amount.indexOf('e') === -1 && amount.indexOf('E') === -1) {
    return fromSatoshi(amount);
  }
  
  // Otherwise, it's a decimal amount, so format it directly
  return numericAmount.toFixed(8).replace(/\.?0+$/, '');
};

export const parseAmount = (amount: string): bigint => {
  const satoshiAmount = toSatoshi(parseFloat(amount));
  return globalThis.BigInt(satoshiAmount);
};

export const calculateFee = (amount: string): string => {
  const baseFee = 10; // 10 Dingocoins base fee
  const percentageFee = parseFloat(amount) * 0.01; // 1% fee
  return (baseFee + percentageFee).toString();
};

export const getNetworkDisplayName = (networkKey: string): string => {
  const networkNames: Record<string, string> = {
    'bsc': 'Binance Smart Chain (BSC)',
    'polygon': 'Polygon (POL)',
    'tbnb': 'Tbnb Testnet',
  };
  return networkNames[networkKey] || networkKey;
};

export interface ConsensusResult {
  depositAddress: string | null;
  goodNodes: number[];
  consensusCount: number;
  hasConsensus: boolean;
}

export const queryDepositAddressWithConsensus = async (
  network: NetworkConfig,
  mintAddress: string,
  aliveNodes: number[]
): Promise<ConsensusResult> => {
  if (aliveNodes.length === 0) {
    return {
      depositAddress: null,
      goodNodes: [],
      consensusCount: 0,
      hasConsensus: false
    };
  }

  // Query all alive nodes for the deposit address
  const nodeResponses = await Promise.allSettled(
    aliveNodes.map(async (nodeIndex) => {
      const node = network.authorityNodes[nodeIndex];
      try {
        const response = await post(`${authorityLink(node)}/queryMintBalance`, {
          mintAddress
        });
        return {
          nodeIndex,
          depositAddress: response.data?.depositAddress || null,
          data: response.data
        };
      } catch (error) {
        return {
          nodeIndex,
          depositAddress: null,
          data: null,
          error
        };
      }
    })
  );

  // Extract successful responses
  const successfulResponses = nodeResponses
    .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
    .map(result => result.value)
    .filter(response => response.depositAddress !== null);

  if (successfulResponses.length === 0) {
    return {
      depositAddress: null,
      goodNodes: [],
      consensusCount: 0,
      hasConsensus: false
    };
  }

  // Group responses by deposit address
  const addressGroups = new Map<string, { nodes: number[], data: any }>();
  
  successfulResponses.forEach(response => {
    const address = response.depositAddress;
    if (!addressGroups.has(address)) {
      addressGroups.set(address, { nodes: [], data: response.data });
    }
    addressGroups.get(address)!.nodes.push(response.nodeIndex);
  });

  // Find the address with the most consensus
  let bestConsensus = {
    depositAddress: null as string | null,
    goodNodes: [] as number[],
    consensusCount: 0
  };

  addressGroups.forEach((group, address) => {
    if (group.nodes.length > bestConsensus.consensusCount) {
      bestConsensus = {
        depositAddress: address,
        goodNodes: group.nodes,
        consensusCount: group.nodes.length
      };
    }
  });

  // Check if we have sufficient consensus (meets threshold)
  const hasConsensus = bestConsensus.consensusCount >= network.authorityThreshold;

  return {
    depositAddress: hasConsensus ? bestConsensus.depositAddress : null,
    goodNodes: hasConsensus ? bestConsensus.goodNodes : [],
    consensusCount: bestConsensus.consensusCount,
    hasConsensus
  };
};

export const getConsensusAuthorityLink = (network: NetworkConfig, goodNodes: number[]): string => {
  if (goodNodes.length === 0) {
    // Fallback to any available node if no consensus
    return getRandomAuthorityLink(network);
  }
  
  const nodeIndex = goodNodes[Math.floor(Math.random() * goodNodes.length)];
  const node = network.authorityNodes[nodeIndex];
  return authorityLink(node);
}; 