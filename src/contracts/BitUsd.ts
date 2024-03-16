import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BitUsd
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const bitUsdAbi = [
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitUsdAbi}__
 */
export const useReadBitUsd = /*#__PURE__*/ createUseReadContract({
  abi: bitUsdAbi
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitUsdAbi}__ and `functionName` set to `"allowance"`
 */
export const useReadBitUsdAllowance = /*#__PURE__*/ createUseReadContract({
  abi: bitUsdAbi,
  functionName: 'allowance'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitUsdAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadBitUsdBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: bitUsdAbi,
  functionName: 'balanceOf'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitUsdAbi}__ and `functionName` set to `"caller"`
 */
export const useReadBitUsdCaller = /*#__PURE__*/ createUseReadContract({
  abi: bitUsdAbi,
  functionName: 'caller'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitUsdAbi}__ and `functionName` set to `"decimals"`
 */
export const useReadBitUsdDecimals = /*#__PURE__*/ createUseReadContract({
  abi: bitUsdAbi,
  functionName: 'decimals'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitUsdAbi}__ and `functionName` set to `"initialized"`
 */
export const useReadBitUsdInitialized = /*#__PURE__*/ createUseReadContract({
  abi: bitUsdAbi,
  functionName: 'initialized'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitUsdAbi}__ and `functionName` set to `"name"`
 */
export const useReadBitUsdName = /*#__PURE__*/ createUseReadContract({
  abi: bitUsdAbi,
  functionName: 'name'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitUsdAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadBitUsdSymbol = /*#__PURE__*/ createUseReadContract({
  abi: bitUsdAbi,
  functionName: 'symbol'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitUsdAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadBitUsdTotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: bitUsdAbi,
  functionName: 'totalSupply'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitUsdAbi}__
 */
export const useWriteBitUsd = /*#__PURE__*/ createUseWriteContract({
  abi: bitUsdAbi
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitUsdAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteBitUsdApprove = /*#__PURE__*/ createUseWriteContract({
  abi: bitUsdAbi,
  functionName: 'approve'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitUsdAbi}__ and `functionName` set to `"burn"`
 */
export const useWriteBitUsdBurn = /*#__PURE__*/ createUseWriteContract({
  abi: bitUsdAbi,
  functionName: 'burn'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitUsdAbi}__ and `functionName` set to `"decreaseAllowance"`
 */
export const useWriteBitUsdDecreaseAllowance =
  /*#__PURE__*/ createUseWriteContract({
    abi: bitUsdAbi,
    functionName: 'decreaseAllowance'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitUsdAbi}__ and `functionName` set to `"increaseAllowance"`
 */
export const useWriteBitUsdIncreaseAllowance =
  /*#__PURE__*/ createUseWriteContract({
    abi: bitUsdAbi,
    functionName: 'increaseAllowance'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitUsdAbi}__ and `functionName` set to `"init"`
 */
export const useWriteBitUsdInit = /*#__PURE__*/ createUseWriteContract({
  abi: bitUsdAbi,
  functionName: 'init'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitUsdAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteBitUsdMint = /*#__PURE__*/ createUseWriteContract({
  abi: bitUsdAbi,
  functionName: 'mint'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitUsdAbi}__ and `functionName` set to `"transfer"`
 */
export const useWriteBitUsdTransfer = /*#__PURE__*/ createUseWriteContract({
  abi: bitUsdAbi,
  functionName: 'transfer'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitUsdAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteBitUsdTransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: bitUsdAbi,
  functionName: 'transferFrom'
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitUsdAbi}__
 */
export const useSimulateBitUsd = /*#__PURE__*/ createUseSimulateContract({
  abi: bitUsdAbi
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitUsdAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateBitUsdApprove = /*#__PURE__*/ createUseSimulateContract(
  { abi: bitUsdAbi, functionName: 'approve' }
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitUsdAbi}__ and `functionName` set to `"burn"`
 */
export const useSimulateBitUsdBurn = /*#__PURE__*/ createUseSimulateContract({
  abi: bitUsdAbi,
  functionName: 'burn'
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitUsdAbi}__ and `functionName` set to `"decreaseAllowance"`
 */
export const useSimulateBitUsdDecreaseAllowance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitUsdAbi,
    functionName: 'decreaseAllowance'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitUsdAbi}__ and `functionName` set to `"increaseAllowance"`
 */
export const useSimulateBitUsdIncreaseAllowance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitUsdAbi,
    functionName: 'increaseAllowance'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitUsdAbi}__ and `functionName` set to `"init"`
 */
export const useSimulateBitUsdInit = /*#__PURE__*/ createUseSimulateContract({
  abi: bitUsdAbi,
  functionName: 'init'
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitUsdAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateBitUsdMint = /*#__PURE__*/ createUseSimulateContract({
  abi: bitUsdAbi,
  functionName: 'mint'
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitUsdAbi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateBitUsdTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitUsdAbi,
    functionName: 'transfer'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitUsdAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateBitUsdTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitUsdAbi,
    functionName: 'transferFrom'
  })
