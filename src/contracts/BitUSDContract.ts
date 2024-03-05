import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BitUSDContract
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const bitUsdContractAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'name_', internalType: 'string', type: 'string' },
      { name: 'symbol_', internalType: 'string', type: 'string' }
    ],
    stateMutability: 'nonpayable'
  },
  { type: 'error', inputs: [], name: 'AlreadyInitialized' },
  { type: 'error', inputs: [], name: 'NotCaller' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'Approval'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'Transfer'
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_recipient', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'caller',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'subtractedValue', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'decreaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'addedValue', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'increaseAllowance',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '_caller', internalType: 'address', type: 'address' }],
    name: 'init',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'initialized',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_recipient', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitUsdContractAbi}__
 */
export const useReadBitUsdContract = /*#__PURE__*/ createUseReadContract({
  abi: bitUsdContractAbi
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitUsdContractAbi}__ and `functionName` set to `"allowance"`
 */
export const useReadBitUsdContractAllowance =
  /*#__PURE__*/ createUseReadContract({
    abi: bitUsdContractAbi,
    functionName: 'allowance'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitUsdContractAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadBitUsdContractBalanceOf =
  /*#__PURE__*/ createUseReadContract({
    abi: bitUsdContractAbi,
    functionName: 'balanceOf'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitUsdContractAbi}__ and `functionName` set to `"caller"`
 */
export const useReadBitUsdContractCaller = /*#__PURE__*/ createUseReadContract({
  abi: bitUsdContractAbi,
  functionName: 'caller'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitUsdContractAbi}__ and `functionName` set to `"decimals"`
 */
export const useReadBitUsdContractDecimals =
  /*#__PURE__*/ createUseReadContract({
    abi: bitUsdContractAbi,
    functionName: 'decimals'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitUsdContractAbi}__ and `functionName` set to `"initialized"`
 */
export const useReadBitUsdContractInitialized =
  /*#__PURE__*/ createUseReadContract({
    abi: bitUsdContractAbi,
    functionName: 'initialized'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitUsdContractAbi}__ and `functionName` set to `"name"`
 */
export const useReadBitUsdContractName = /*#__PURE__*/ createUseReadContract({
  abi: bitUsdContractAbi,
  functionName: 'name'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitUsdContractAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadBitUsdContractSymbol = /*#__PURE__*/ createUseReadContract({
  abi: bitUsdContractAbi,
  functionName: 'symbol'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitUsdContractAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadBitUsdContractTotalSupply =
  /*#__PURE__*/ createUseReadContract({
    abi: bitUsdContractAbi,
    functionName: 'totalSupply'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitUsdContractAbi}__
 */
export const useWriteBitUsdContract = /*#__PURE__*/ createUseWriteContract({
  abi: bitUsdContractAbi
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitUsdContractAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteBitUsdContractApprove =
  /*#__PURE__*/ createUseWriteContract({
    abi: bitUsdContractAbi,
    functionName: 'approve'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitUsdContractAbi}__ and `functionName` set to `"burn"`
 */
export const useWriteBitUsdContractBurn = /*#__PURE__*/ createUseWriteContract({
  abi: bitUsdContractAbi,
  functionName: 'burn'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitUsdContractAbi}__ and `functionName` set to `"decreaseAllowance"`
 */
export const useWriteBitUsdContractDecreaseAllowance =
  /*#__PURE__*/ createUseWriteContract({
    abi: bitUsdContractAbi,
    functionName: 'decreaseAllowance'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitUsdContractAbi}__ and `functionName` set to `"increaseAllowance"`
 */
export const useWriteBitUsdContractIncreaseAllowance =
  /*#__PURE__*/ createUseWriteContract({
    abi: bitUsdContractAbi,
    functionName: 'increaseAllowance'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitUsdContractAbi}__ and `functionName` set to `"init"`
 */
export const useWriteBitUsdContractInit = /*#__PURE__*/ createUseWriteContract({
  abi: bitUsdContractAbi,
  functionName: 'init'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitUsdContractAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteBitUsdContractMint = /*#__PURE__*/ createUseWriteContract({
  abi: bitUsdContractAbi,
  functionName: 'mint'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitUsdContractAbi}__ and `functionName` set to `"transfer"`
 */
export const useWriteBitUsdContractTransfer =
  /*#__PURE__*/ createUseWriteContract({
    abi: bitUsdContractAbi,
    functionName: 'transfer'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitUsdContractAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteBitUsdContractTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: bitUsdContractAbi,
    functionName: 'transferFrom'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitUsdContractAbi}__
 */
export const useSimulateBitUsdContract =
  /*#__PURE__*/ createUseSimulateContract({ abi: bitUsdContractAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitUsdContractAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateBitUsdContractApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitUsdContractAbi,
    functionName: 'approve'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitUsdContractAbi}__ and `functionName` set to `"burn"`
 */
export const useSimulateBitUsdContractBurn =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitUsdContractAbi,
    functionName: 'burn'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitUsdContractAbi}__ and `functionName` set to `"decreaseAllowance"`
 */
export const useSimulateBitUsdContractDecreaseAllowance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitUsdContractAbi,
    functionName: 'decreaseAllowance'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitUsdContractAbi}__ and `functionName` set to `"increaseAllowance"`
 */
export const useSimulateBitUsdContractIncreaseAllowance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitUsdContractAbi,
    functionName: 'increaseAllowance'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitUsdContractAbi}__ and `functionName` set to `"init"`
 */
export const useSimulateBitUsdContractInit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitUsdContractAbi,
    functionName: 'init'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitUsdContractAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateBitUsdContractMint =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitUsdContractAbi,
    functionName: 'mint'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitUsdContractAbi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateBitUsdContractTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitUsdContractAbi,
    functionName: 'transfer'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitUsdContractAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateBitUsdContractTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitUsdContractAbi,
    functionName: 'transferFrom'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link bitUsdContractAbi}__
 */
export const useWatchBitUsdContractEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: bitUsdContractAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link bitUsdContractAbi}__ and `eventName` set to `"Approval"`
 */
export const useWatchBitUsdContractApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: bitUsdContractAbi,
    eventName: 'Approval'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link bitUsdContractAbi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchBitUsdContractTransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: bitUsdContractAbi,
    eventName: 'Transfer'
  })
