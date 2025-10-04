/**
 * Consensus Validator Utility
 * 
 * Handles fault-tolerant consensus validation for mint transactions
 * across multiple authority nodes using a 3-of-N consensus model.
 */

/**
 * Validates consensus among authority nodes for mint transaction data
 * 
 * @param {Array} availableTransactionInfos - Array of transaction info from responding nodes
 * @param {string} expectedDepositAddress - Expected deposit address for validation
 * @param {number} authorityThreshold - Minimum number of nodes required for consensus (e.g., 3)
 * @param {Array} allTransactionInfos - Full array including undefined entries for failed nodes
 * @returns {Object} Consensus validation result
 */
export const validateMintConsensus = (
  availableTransactionInfos, 
  expectedDepositAddress, 
  authorityThreshold,
  allTransactionInfos
) => {
  // Group responses by their values to find consensus
  const mintAddressGroups = new Map();
  const nonceGroups = new Map();
  const depositAddressGroups = new Map();
  const mintAmountGroups = new Map();

  availableTransactionInfos.forEach((info, index) => {
    // Group by mint address
    if (!mintAddressGroups.has(info.mintAddress)) {
      mintAddressGroups.set(info.mintAddress, []);
    }
    mintAddressGroups.get(info.mintAddress).push({ index, info });

    // Group by nonce
    if (!nonceGroups.has(info.nonce)) {
      nonceGroups.set(info.nonce, []);
    }
    nonceGroups.get(info.nonce).push({ index, info });

    // Group by deposit address
    if (!depositAddressGroups.has(info.depositAddress)) {
      depositAddressGroups.set(info.depositAddress, []);
    }
    depositAddressGroups.get(info.depositAddress).push({ index, info });

    // Group by mint amount
    if (!mintAmountGroups.has(info.mintAmount)) {
      mintAmountGroups.set(info.mintAmount, []);
    }
    mintAmountGroups.get(info.mintAmount).push({ index, info });
  });

  // Find consensus values (values agreed upon by at least authorityThreshold nodes)
  const findConsensusValue = (groups, fieldName) => {
    for (const [value, nodes] of groups) {
      if (nodes.length >= authorityThreshold) {
        console.log(`${fieldName} consensus found:`, { 
          value, 
          agreeing_nodes: nodes.length, 
          required: authorityThreshold 
        });
        return { value, nodes };
      }
    }
    
    // Log the disagreement for debugging
    console.error(`${fieldName} consensus failure:`, {
      groups: Array.from(groups.entries()).map(([value, nodes]) => ({ value, count: nodes.length })),
      required: authorityThreshold,
      available: availableTransactionInfos.length
    });
    return null;
  };

  // Validate consensus for each field
  const mintAddressConsensus = findConsensusValue(mintAddressGroups, 'Mint address');
  if (!mintAddressConsensus) {
    return {
      success: false,
      error: "Consensus failure on mint address: Not enough nodes agree on the same mint address."
    };
  }

  const nonceConsensus = findConsensusValue(nonceGroups, 'Nonce');
  if (!nonceConsensus) {
    return {
      success: false,
      error: "Consensus failure on nonce: Not enough nodes agree on the same nonce."
    };
  }

  const depositAddressConsensus = findConsensusValue(depositAddressGroups, 'Deposit address');
  if (!depositAddressConsensus || depositAddressConsensus.value !== expectedDepositAddress) {
    return {
      success: false,
      error: "Consensus failure on deposit address: Not enough nodes agree on the expected deposit address."
    };
  }

  const mintAmountConsensus = findConsensusValue(mintAmountGroups, 'Mint amount');
  if (!mintAmountConsensus) {
    return {
      success: false,
      error: "Consensus failure on mint amount: Not enough nodes agree on the same mint amount."
    };
  }

  // Use the consensus values
  const consensusValues = {
    mintAddress: mintAddressConsensus.value,
    nonce: nonceConsensus.value,
    depositAddress: depositAddressConsensus.value,
    mintAmount: mintAmountConsensus.value
  };

  console.log('Consensus achieved:', {
    ...consensusValues,
    agreeingNodes: {
      mintAddress: mintAddressConsensus.nodes.length,
      nonce: nonceConsensus.nodes.length,
      depositAddress: depositAddressConsensus.nodes.length,
      mintAmount: mintAmountConsensus.nodes.length
    }
  });

  // Find nodes that agree on all consensus values
  const consensusNodeIndices = new Set();
  
  availableTransactionInfos.forEach((info, responseIndex) => {
    if (info.mintAddress === consensusValues.mintAddress &&
        info.nonce === consensusValues.nonce &&
        info.depositAddress === consensusValues.depositAddress &&
        info.mintAmount === consensusValues.mintAmount) {
      // Find the original node index for this response
      let originalNodeIndex = -1;
      for (let i = 0; i < allTransactionInfos.length; i++) {
        if (allTransactionInfos[i] === info) {
          originalNodeIndex = i;
          break;
        }
      }
      if (originalNodeIndex !== -1) {
        consensusNodeIndices.add(originalNodeIndex);
      }
    }
  });

  console.log('Consensus node indices:', Array.from(consensusNodeIndices));

  return {
    success: true,
    consensusValues,
    consensusNodeIndices: Array.from(consensusNodeIndices)
  };
};

/**
 * Validates signatures from consensus nodes
 * 
 * @param {Array} allTransactionInfos - Full array of transaction info including undefined entries
 * @param {Array} consensusNodeIndices - Indices of nodes that achieved consensus
 * @param {number} authorityThreshold - Minimum number of valid signatures required
 * @param {Object} consensusValues - The consensus values for logging
 * @returns {Object} Signature validation result
 */
export const validateConsensusSignatures = (
  allTransactionInfos,
  consensusNodeIndices,
  authorityThreshold,
  consensusValues
) => {
  // Create signature arrays
  const signV = allTransactionInfos.map((x) =>
    x === undefined ? "0x0" : x.onContractVerification.v
  );
  const signR = allTransactionInfos.map((x) =>
    x === undefined ? "0x0" : x.onContractVerification.r
  );
  const signS = allTransactionInfos.map((x) =>
    x === undefined ? "0x0" : x.onContractVerification.s
  );

  // Log final signature arrays for debugging
  console.log('Final signature arrays:', {
    depositAddress: consensusValues.depositAddress,
    mintAmount: consensusValues.mintAmount,
    signV,
    signR,
    signS,
    nodeCount: allTransactionInfos.length,
    consensusNodes: consensusNodeIndices
  });

  // Validate signatures from consensus nodes only
  const validConsensusSignatureCount = consensusNodeIndices.filter(nodeIndex => {
    const info = allTransactionInfos[nodeIndex];
    return info && 
           info.onContractVerification &&
           info.onContractVerification.v !== "0x0" && 
           info.onContractVerification.r !== "0x0" && 
           info.onContractVerification.s !== "0x0";
  }).length;

  if (validConsensusSignatureCount < authorityThreshold) {
    console.error('Insufficient valid consensus signatures:', {
      validConsensusCount: validConsensusSignatureCount,
      required: authorityThreshold,
      consensusNodes: consensusNodeIndices,
      signatures: consensusNodeIndices.map(nodeIndex => ({
        node: nodeIndex,
        hasData: allTransactionInfos[nodeIndex] !== undefined,
        v: allTransactionInfos[nodeIndex]?.onContractVerification?.v || 'missing',
        r: allTransactionInfos[nodeIndex]?.onContractVerification?.r || 'missing',
        s: allTransactionInfos[nodeIndex]?.onContractVerification?.s || 'missing'
      }))
    });
    return {
      success: false,
      error: `Insufficient valid signatures from consensus nodes. Got ${validConsensusSignatureCount} valid signatures from consensus nodes, need ${authorityThreshold}.\nCheck console for detailed signature analysis.`
    };
  }

  // Final validation: Check if we have enough non-zero signatures in the consensus positions
  const nonZeroConsensusSignatures = consensusNodeIndices.filter(nodeIndex => 
    signV[nodeIndex] !== "0x0" && signR[nodeIndex] !== "0x0" && signS[nodeIndex] !== "0x0"
  ).length;
  
  if (nonZeroConsensusSignatures < authorityThreshold) {
    console.error('Consensus signature array validation failed:', {
      nonZeroConsensusCount: nonZeroConsensusSignatures,
      required: authorityThreshold,
      consensusNodes: consensusNodeIndices,
      signatureArrays: { signV, signR, signS }
    });
    return {
      success: false,
      error: `Consensus signature validation failed. Expected ${authorityThreshold} valid signatures from consensus nodes but got ${nonZeroConsensusSignatures}.\nThis indicates a signature mismatch issue. Check console for details.`
    };
  }

  return {
    success: true,
    signatureArrays: { signV, signR, signS }
  };
};

/**
 * Complete consensus validation workflow for mint transactions
 * 
 * @param {Array} availableTransactionInfos - Array of transaction info from responding nodes
 * @param {string} expectedDepositAddress - Expected deposit address for validation
 * @param {number} authorityThreshold - Minimum number of nodes required for consensus
 * @param {Array} allTransactionInfos - Full array including undefined entries for failed nodes
 * @returns {Object} Complete validation result
 */
export const validateMintTransactionConsensus = (
  availableTransactionInfos,
  expectedDepositAddress,
  authorityThreshold,
  allTransactionInfos
) => {
  // Step 1: Validate consensus on transaction parameters
  const consensusResult = validateMintConsensus(
    availableTransactionInfos,
    expectedDepositAddress,
    authorityThreshold,
    allTransactionInfos
  );

  if (!consensusResult.success) {
    return consensusResult;
  }

  // Step 2: Validate signatures from consensus nodes
  const signatureResult = validateConsensusSignatures(
    allTransactionInfos,
    consensusResult.consensusNodeIndices,
    authorityThreshold,
    consensusResult.consensusValues
  );

  if (!signatureResult.success) {
    return signatureResult;
  }

  // Return successful result with all necessary data
  return {
    success: true,
    consensusValues: consensusResult.consensusValues,
    signatureArrays: signatureResult.signatureArrays,
    consensusNodeIndices: consensusResult.consensusNodeIndices
  };
};
