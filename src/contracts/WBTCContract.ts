import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// WBTCContract
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const wbtcContractAbi = [
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link wbtcContractAbi}__
 */
export const useReadWbtcContract = /*#__PURE__*/ createUseReadContract({
  abi: wbtcContractAbi
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link wbtcContractAbi}__ and `functionName` set to `"allowance"`
 */
export const useReadWbtcContractAllowance = /*#__PURE__*/ createUseReadContract(
  { abi: wbtcContractAbi, functionName: 'allowance' }
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link wbtcContractAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadWbtcContractBalanceOf = /*#__PURE__*/ createUseReadContract(
  { abi: wbtcContractAbi, functionName: 'balanceOf' }
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link wbtcContractAbi}__ and `functionName` set to `"caller"`
 */
export const useReadWbtcContractCaller = /*#__PURE__*/ createUseReadContract({
  abi: wbtcContractAbi,
  functionName: 'caller'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link wbtcContractAbi}__ and `functionName` set to `"decimals"`
 */
export const useReadWbtcContractDecimals = /*#__PURE__*/ createUseReadContract({
  abi: wbtcContractAbi,
  functionName: 'decimals'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link wbtcContractAbi}__ and `functionName` set to `"initialized"`
 */
export const useReadWbtcContractInitialized =
  /*#__PURE__*/ createUseReadContract({
    abi: wbtcContractAbi,
    functionName: 'initialized'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link wbtcContractAbi}__ and `functionName` set to `"name"`
 */
export const useReadWbtcContractName = /*#__PURE__*/ createUseReadContract({
  abi: wbtcContractAbi,
  functionName: 'name'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link wbtcContractAbi}__ and `functionName` set to `"symbol"`
 */
export const useReadWbtcContractSymbol = /*#__PURE__*/ createUseReadContract({
  abi: wbtcContractAbi,
  functionName: 'symbol'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link wbtcContractAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadWbtcContractTotalSupply =
  /*#__PURE__*/ createUseReadContract({
    abi: wbtcContractAbi,
    functionName: 'totalSupply'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link wbtcContractAbi}__
 */
export const useWriteWbtcContract = /*#__PURE__*/ createUseWriteContract({
  abi: wbtcContractAbi
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link wbtcContractAbi}__ and `functionName` set to `"approve"`
 */
export const useWriteWbtcContractApprove = /*#__PURE__*/ createUseWriteContract(
  { abi: wbtcContractAbi, functionName: 'approve' }
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link wbtcContractAbi}__ and `functionName` set to `"burn"`
 */
export const useWriteWbtcContractBurn = /*#__PURE__*/ createUseWriteContract({
  abi: wbtcContractAbi,
  functionName: 'burn'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link wbtcContractAbi}__ and `functionName` set to `"decreaseAllowance"`
 */
export const useWriteWbtcContractDecreaseAllowance =
  /*#__PURE__*/ createUseWriteContract({
    abi: wbtcContractAbi,
    functionName: 'decreaseAllowance'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link wbtcContractAbi}__ and `functionName` set to `"increaseAllowance"`
 */
export const useWriteWbtcContractIncreaseAllowance =
  /*#__PURE__*/ createUseWriteContract({
    abi: wbtcContractAbi,
    functionName: 'increaseAllowance'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link wbtcContractAbi}__ and `functionName` set to `"init"`
 */
export const useWriteWbtcContractInit = /*#__PURE__*/ createUseWriteContract({
  abi: wbtcContractAbi,
  functionName: 'init'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link wbtcContractAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteWbtcContractMint = /*#__PURE__*/ createUseWriteContract({
  abi: wbtcContractAbi,
  functionName: 'mint'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link wbtcContractAbi}__ and `functionName` set to `"transfer"`
 */
export const useWriteWbtcContractTransfer =
  /*#__PURE__*/ createUseWriteContract({
    abi: wbtcContractAbi,
    functionName: 'transfer'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link wbtcContractAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteWbtcContractTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: wbtcContractAbi,
    functionName: 'transferFrom'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link wbtcContractAbi}__
 */
export const useSimulateWbtcContract = /*#__PURE__*/ createUseSimulateContract({
  abi: wbtcContractAbi
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link wbtcContractAbi}__ and `functionName` set to `"approve"`
 */
export const useSimulateWbtcContractApprove =
  /*#__PURE__*/ createUseSimulateContract({
    abi: wbtcContractAbi,
    functionName: 'approve'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link wbtcContractAbi}__ and `functionName` set to `"burn"`
 */
export const useSimulateWbtcContractBurn =
  /*#__PURE__*/ createUseSimulateContract({
    abi: wbtcContractAbi,
    functionName: 'burn'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link wbtcContractAbi}__ and `functionName` set to `"decreaseAllowance"`
 */
export const useSimulateWbtcContractDecreaseAllowance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: wbtcContractAbi,
    functionName: 'decreaseAllowance'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link wbtcContractAbi}__ and `functionName` set to `"increaseAllowance"`
 */
export const useSimulateWbtcContractIncreaseAllowance =
  /*#__PURE__*/ createUseSimulateContract({
    abi: wbtcContractAbi,
    functionName: 'increaseAllowance'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link wbtcContractAbi}__ and `functionName` set to `"init"`
 */
export const useSimulateWbtcContractInit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: wbtcContractAbi,
    functionName: 'init'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link wbtcContractAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateWbtcContractMint =
  /*#__PURE__*/ createUseSimulateContract({
    abi: wbtcContractAbi,
    functionName: 'mint'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link wbtcContractAbi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateWbtcContractTransfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: wbtcContractAbi,
    functionName: 'transfer'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link wbtcContractAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateWbtcContractTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: wbtcContractAbi,
    functionName: 'transferFrom'
  })
