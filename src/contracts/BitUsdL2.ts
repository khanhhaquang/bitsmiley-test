import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BitUsdL2
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const bitUsdL2Abi = [
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitUsdL2Abi}__
 */
export const useReadBitUsdL2 = /*#__PURE__*/ createUseReadContract({
  abi: bitUsdL2Abi
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitUsdL2Abi}__ and `functionName` set to `"allowance"`
 */
export const useReadBitUsdL2Allowance = /*#__PURE__*/ createUseReadContract({
  abi: bitUsdL2Abi,
  functionName: 'allowance'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitUsdL2Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadBitUsdL2BalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: bitUsdL2Abi,
  functionName: 'balanceOf'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitUsdL2Abi}__ and `functionName` set to `"caller"`
 */
export const useReadBitUsdL2Caller = /*#__PURE__*/ createUseReadContract({
  abi: bitUsdL2Abi,
  functionName: 'caller'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitUsdL2Abi}__ and `functionName` set to `"decimals"`
 */
export const useReadBitUsdL2Decimals = /*#__PURE__*/ createUseReadContract({
  abi: bitUsdL2Abi,
  functionName: 'decimals'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitUsdL2Abi}__ and `functionName` set to `"initialized"`
 */
export const useReadBitUsdL2Initialized = /*#__PURE__*/ createUseReadContract({
  abi: bitUsdL2Abi,
  functionName: 'initialized'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitUsdL2Abi}__ and `functionName` set to `"name"`
 */
export const useReadBitUsdL2Name = /*#__PURE__*/ createUseReadContract({
  abi: bitUsdL2Abi,
  functionName: 'name'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitUsdL2Abi}__ and `functionName` set to `"symbol"`
 */
export const useReadBitUsdL2Symbol = /*#__PURE__*/ createUseReadContract({
  abi: bitUsdL2Abi,
  functionName: 'symbol'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitUsdL2Abi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadBitUsdL2TotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: bitUsdL2Abi,
  functionName: 'totalSupply'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitUsdL2Abi}__
 */
export const useWriteBitUsdL2 = /*#__PURE__*/ createUseWriteContract({
  abi: bitUsdL2Abi
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitUsdL2Abi}__ and `functionName` set to `"approve"`
 */
export const useWriteBitUsdL2Approve = /*#__PURE__*/ createUseWriteContract({
  abi: bitUsdL2Abi,
  functionName: 'approve'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitUsdL2Abi}__ and `functionName` set to `"burn"`
 */
export const useWriteBitUsdL2Burn = /*#__PURE__*/ createUseWriteContract({
  abi: bitUsdL2Abi,
  functionName: 'burn'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitUsdL2Abi}__ and `functionName` set to `"decreaseAllowance"`
 */
export const useWriteBitUsdL2DecreaseAllowance =
  /*#__PURE__*/ createUseWriteContract({
    abi: bitUsdL2Abi,
    functionName: 'decreaseAllowance'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitUsdL2Abi}__ and `functionName` set to `"increaseAllowance"`
 */
export const useWriteBitUsdL2IncreaseAllowance =
  /*#__PURE__*/ createUseWriteContract({
    abi: bitUsdL2Abi,
    functionName: 'increaseAllowance'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitUsdL2Abi}__ and `functionName` set to `"init"`
 */
export const useWriteBitUsdL2Init = /*#__PURE__*/ createUseWriteContract({
  abi: bitUsdL2Abi,
  functionName: 'init'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitUsdL2Abi}__ and `functionName` set to `"mint"`
 */
export const useWriteBitUsdL2Mint = /*#__PURE__*/ createUseWriteContract({
  abi: bitUsdL2Abi,
  functionName: 'mint'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitUsdL2Abi}__ and `functionName` set to `"transfer"`
 */
export const useWriteBitUsdL2Transfer = /*#__PURE__*/ createUseWriteContract({
  abi: bitUsdL2Abi,
  functionName: 'transfer'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitUsdL2Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteBitUsdL2TransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: bitUsdL2Abi,
    functionName: 'transferFrom'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitUsdL2Abi}__
 */
export const useSimulateBitUsdL2 = /*#__PURE__*/ createUseSimulateContract({
  abi: bitUsdL2Abi
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitUsdL2Abi}__ and `functionName` set to `"approve"`
 */
export const useSimulateBitUsdL2Approve =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitUsdL2Abi,
    functionName: 'approve'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitUsdL2Abi}__ and `functionName` set to `"burn"`
 */
export const useSimulateBitUsdL2Burn = /*#__PURE__*/ createUseSimulateContract({
  abi: bitUsdL2Abi,
  functionName: 'burn'
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitUsdL2Abi}__ and `functionName` set to `"decreaseAllowance"`
 */
export const useSimulateBitUsdL2DecreaseAllowance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitUsdL2Abi,
    functionName: 'decreaseAllowance'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitUsdL2Abi}__ and `functionName` set to `"increaseAllowance"`
 */
export const useSimulateBitUsdL2IncreaseAllowance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitUsdL2Abi,
    functionName: 'increaseAllowance'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitUsdL2Abi}__ and `functionName` set to `"init"`
 */
export const useSimulateBitUsdL2Init = /*#__PURE__*/ createUseSimulateContract({
  abi: bitUsdL2Abi,
  functionName: 'init'
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitUsdL2Abi}__ and `functionName` set to `"mint"`
 */
export const useSimulateBitUsdL2Mint = /*#__PURE__*/ createUseSimulateContract({
  abi: bitUsdL2Abi,
  functionName: 'mint'
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitUsdL2Abi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateBitUsdL2Transfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitUsdL2Abi,
    functionName: 'transfer'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitUsdL2Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateBitUsdL2TransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitUsdL2Abi,
    functionName: 'transferFrom'
  })
