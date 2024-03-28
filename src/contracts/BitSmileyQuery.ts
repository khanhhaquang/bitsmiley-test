import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BitSmileyQuery
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const bitSmileyQueryAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_bitsmiley', internalType: 'address', type: 'address' },
      { name: '_vaultManager', internalType: 'address', type: 'address' },
      { name: '_stabilityFee', internalType: 'address', type: 'address' }
    ],
    stateMutability: 'nonpayable'
  },
  { type: 'error', inputs: [], name: 'NotCaller' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'prev',
        internalType: 'address',
        type: 'address',
        indexed: false
      },
      {
        name: 'curr',
        internalType: 'address',
        type: 'address',
        indexed: false
      }
    ],
    name: 'CallerUpdated'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'who', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'collateralId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false
      },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'maxLTV',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'CollateralConfigUpdated'
  },
  {
    type: 'function',
    inputs: [],
    name: 'bitsmiley',
    outputs: [
      { name: '', internalType: 'contract BitSmileyLike', type: 'address' }
    ],
    stateMutability: 'view'
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
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'collateralConfig',
    outputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'maxLTV', internalType: 'uint256', type: 'uint256' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_vault', internalType: 'address', type: 'address' },
      { name: '_collateral', internalType: 'int256', type: 'int256' },
      { name: '_bitUSD', internalType: 'int256', type: 'int256' },
      { name: '_protectionSafety', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'getVaultDetail',
    outputs: [
      {
        name: 'detail',
        internalType: 'struct VaultDetail',
        type: 'tuple',
        components: [
          {
            name: 'liquidationPrice',
            internalType: 'uint256',
            type: 'uint256'
          },
          { name: 'healthFactor', internalType: 'uint256', type: 'uint256' },
          { name: 'debt', internalType: 'uint256', type: 'uint256' },
          { name: 'fee', internalType: 'uint256', type: 'uint256' },
          { name: 'mintedBitUSD', internalType: 'uint256', type: 'uint256' },
          {
            name: 'lockedCollateral',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'availableToWithdraw',
            internalType: 'int256',
            type: 'int256'
          },
          { name: 'availableToMint', internalType: 'int256', type: 'int256' }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'listCollaterals',
    outputs: [
      {
        name: 'collateralInfos',
        internalType: 'struct Collateral[]',
        type: 'tuple[]',
        components: [
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'maxLTV', internalType: 'uint256', type: 'uint256' },
          {
            name: 'liquidationFeeRate',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'stabilityFeeRate',
            internalType: 'uint256',
            type: 'uint256'
          },
          { name: 'collateralId', internalType: 'bytes32', type: 'bytes32' },
          {
            name: 'collateral',
            internalType: 'struct CollateralType',
            type: 'tuple',
            components: [
              {
                name: 'tokenAddress',
                internalType: 'address',
                type: 'address'
              },
              {
                name: 'safetyFactor',
                internalType: 'uint256',
                type: 'uint256'
              },
              { name: 'totalDebt', internalType: 'uint256', type: 'uint256' },
              { name: 'totalLocked', internalType: 'uint256', type: 'uint256' },
              {
                name: 'vaultMaxDebt',
                internalType: 'uint256',
                type: 'uint256'
              },
              {
                name: 'vaultMinDebt',
                internalType: 'uint256',
                type: 'uint256'
              },
              { name: 'maxDebt', internalType: 'uint256', type: 'uint256' }
            ]
          }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_collateralId', internalType: 'bytes32', type: 'bytes32' },
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_maxLTV', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'setCollateralConfig',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'stabilityFee',
    outputs: [
      { name: '', internalType: 'contract StabilityFeeLike', type: 'address' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'vaultManager',
    outputs: [
      { name: '', internalType: 'contract VaultManagerLike', type: 'address' }
    ],
    stateMutability: 'view'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyQueryAbi}__
 */
export const useReadBitSmileyQuery = /*#__PURE__*/ createUseReadContract({
  abi: bitSmileyQueryAbi
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyQueryAbi}__ and `functionName` set to `"bitsmiley"`
 */
export const useReadBitSmileyQueryBitsmiley =
  /*#__PURE__*/ createUseReadContract({
    abi: bitSmileyQueryAbi,
    functionName: 'bitsmiley'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyQueryAbi}__ and `functionName` set to `"caller"`
 */
export const useReadBitSmileyQueryCaller = /*#__PURE__*/ createUseReadContract({
  abi: bitSmileyQueryAbi,
  functionName: 'caller'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyQueryAbi}__ and `functionName` set to `"collateralConfig"`
 */
export const useReadBitSmileyQueryCollateralConfig =
  /*#__PURE__*/ createUseReadContract({
    abi: bitSmileyQueryAbi,
    functionName: 'collateralConfig'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyQueryAbi}__ and `functionName` set to `"getVaultDetail"`
 */
export const useReadBitSmileyQueryGetVaultDetail =
  /*#__PURE__*/ createUseReadContract({
    abi: bitSmileyQueryAbi,
    functionName: 'getVaultDetail'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyQueryAbi}__ and `functionName` set to `"listCollaterals"`
 */
export const useReadBitSmileyQueryListCollaterals =
  /*#__PURE__*/ createUseReadContract({
    abi: bitSmileyQueryAbi,
    functionName: 'listCollaterals'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyQueryAbi}__ and `functionName` set to `"stabilityFee"`
 */
export const useReadBitSmileyQueryStabilityFee =
  /*#__PURE__*/ createUseReadContract({
    abi: bitSmileyQueryAbi,
    functionName: 'stabilityFee'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyQueryAbi}__ and `functionName` set to `"vaultManager"`
 */
export const useReadBitSmileyQueryVaultManager =
  /*#__PURE__*/ createUseReadContract({
    abi: bitSmileyQueryAbi,
    functionName: 'vaultManager'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitSmileyQueryAbi}__
 */
export const useWriteBitSmileyQuery = /*#__PURE__*/ createUseWriteContract({
  abi: bitSmileyQueryAbi
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitSmileyQueryAbi}__ and `functionName` set to `"setCollateralConfig"`
 */
export const useWriteBitSmileyQuerySetCollateralConfig =
  /*#__PURE__*/ createUseWriteContract({
    abi: bitSmileyQueryAbi,
    functionName: 'setCollateralConfig'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitSmileyQueryAbi}__
 */
export const useSimulateBitSmileyQuery =
  /*#__PURE__*/ createUseSimulateContract({ abi: bitSmileyQueryAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitSmileyQueryAbi}__ and `functionName` set to `"setCollateralConfig"`
 */
export const useSimulateBitSmileyQuerySetCollateralConfig =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitSmileyQueryAbi,
    functionName: 'setCollateralConfig'
  })
