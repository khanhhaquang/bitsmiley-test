import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// smileyContract
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const smileyContractAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'error', inputs: [], name: 'AlreadyOpenedVault' },
  { type: 'error', inputs: [], name: 'CannotBeLiquidated' },
  { type: 'error', inputs: [], name: 'InvalidAmount' },
  { type: 'error', inputs: [], name: 'InvalidPenalty' },
  { type: 'error', inputs: [], name: 'MsgValueIncorrect' },
  { type: 'error', inputs: [], name: 'NotOwner' },
  { type: 'error', inputs: [], name: 'VaultNotRegistered' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false
      }
    ],
    name: 'AdminChanged'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true
      }
    ],
    name: 'BeaconUpgraded'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false }
    ],
    name: 'Initialized'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'vault',
        internalType: 'address',
        type: 'address',
        indexed: false
      },
      {
        name: 'collateral',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      },
      {
        name: 'bitUSD',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      },
      {
        name: 'liquidator',
        internalType: 'address',
        type: 'address',
        indexed: false
      },
      {
        name: 'penalty',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: false
      }
    ],
    name: 'Liquidated'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'user',
        internalType: 'address',
        type: 'address',
        indexed: false
      },
      {
        name: 'vault',
        internalType: 'address',
        type: 'address',
        indexed: false
      },
      {
        name: 'collateral',
        internalType: 'int256',
        type: 'int256',
        indexed: false
      },
      {
        name: 'bitUSD',
        internalType: 'int256',
        type: 'int256',
        indexed: false
      }
    ],
    name: 'Mint'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true
      }
    ],
    name: 'OwnershipTransferred'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'what', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'previous',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      },
      {
        name: 'current',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'ParameterUpdated'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false
      }
    ],
    name: 'Paused'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'user',
        internalType: 'address',
        type: 'address',
        indexed: false
      },
      {
        name: 'vault',
        internalType: 'address',
        type: 'address',
        indexed: false
      },
      {
        name: 'collateral',
        internalType: 'int256',
        type: 'int256',
        indexed: false
      },
      {
        name: 'bitUSD',
        internalType: 'int256',
        type: 'int256',
        indexed: false
      }
    ],
    name: 'Repay'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false
      }
    ],
    name: 'Unpaused'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true
      }
    ],
    name: 'Upgraded'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'user',
        internalType: 'address',
        type: 'address',
        indexed: false
      },
      {
        name: 'vault',
        internalType: 'address',
        type: 'address',
        indexed: false
      }
    ],
    name: 'VaultOpened'
  },
  {
    type: 'function',
    inputs: [],
    name: 'BTC_COLLATERAL_ID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'PENALTY_BASE',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'bitUSD',
    outputs: [{ name: '', internalType: 'contract IToken', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_vaultManager', internalType: 'address', type: 'address' },
      { name: '_liquidationPenalty', internalType: 'uint256', type: 'uint256' },
      { name: '_penaltyRecipient', internalType: 'address', type: 'address' }
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '_vault', internalType: 'address', type: 'address' }],
    name: 'liquidateVaultBTC',
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'liquidationPenalty',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_vault', internalType: 'address', type: 'address' },
      { name: '_bitUSD', internalType: 'int256', type: 'int256' },
      { name: '_collateral', internalType: 'int256', type: 'int256' }
    ],
    name: 'mintFromBTC',
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'openVault',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_bitUSD', internalType: 'int256', type: 'int256' },
      { name: '_collateral', internalType: 'int256', type: 'int256' }
    ],
    name: 'openVaultAndMintFromBTC',
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'owners',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'penaltyRecipient',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_vault', internalType: 'address', type: 'address' },
      { name: '_bitUSD', internalType: 'int256', type: 'int256' },
      { name: '_collateral', internalType: 'int256', type: 'int256' }
    ],
    name: 'repayToBTC',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '_penalty', internalType: 'uint256', type: 'uint256' }],
    name: 'setPenalty',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '_recipient', internalType: 'address', type: 'address' }],
    name: 'setPenaltyRecipient',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' }
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' }
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'vaultManager',
    outputs: [
      { name: '', internalType: 'contract IVaultManager', type: 'address' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'vaults',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link smileyContractAbi}__
 */
export const useReadSmileyContract = /*#__PURE__*/ createUseReadContract({
  abi: smileyContractAbi
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"BTC_COLLATERAL_ID"`
 */
export const useReadSmileyContractBtcCollateralId =
  /*#__PURE__*/ createUseReadContract({
    abi: smileyContractAbi,
    functionName: 'BTC_COLLATERAL_ID'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"PENALTY_BASE"`
 */
export const useReadSmileyContractPenaltyBase =
  /*#__PURE__*/ createUseReadContract({
    abi: smileyContractAbi,
    functionName: 'PENALTY_BASE'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"bitUSD"`
 */
export const useReadSmileyContractBitUsd = /*#__PURE__*/ createUseReadContract({
  abi: smileyContractAbi,
  functionName: 'bitUSD'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"liquidationPenalty"`
 */
export const useReadSmileyContractLiquidationPenalty =
  /*#__PURE__*/ createUseReadContract({
    abi: smileyContractAbi,
    functionName: 'liquidationPenalty'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"owner"`
 */
export const useReadSmileyContractOwner = /*#__PURE__*/ createUseReadContract({
  abi: smileyContractAbi,
  functionName: 'owner'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"owners"`
 */
export const useReadSmileyContractOwners = /*#__PURE__*/ createUseReadContract({
  abi: smileyContractAbi,
  functionName: 'owners'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"paused"`
 */
export const useReadSmileyContractPaused = /*#__PURE__*/ createUseReadContract({
  abi: smileyContractAbi,
  functionName: 'paused'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"penaltyRecipient"`
 */
export const useReadSmileyContractPenaltyRecipient =
  /*#__PURE__*/ createUseReadContract({
    abi: smileyContractAbi,
    functionName: 'penaltyRecipient'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"proxiableUUID"`
 */
export const useReadSmileyContractProxiableUuid =
  /*#__PURE__*/ createUseReadContract({
    abi: smileyContractAbi,
    functionName: 'proxiableUUID'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"vaultManager"`
 */
export const useReadSmileyContractVaultManager =
  /*#__PURE__*/ createUseReadContract({
    abi: smileyContractAbi,
    functionName: 'vaultManager'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"vaults"`
 */
export const useReadSmileyContractVaults = /*#__PURE__*/ createUseReadContract({
  abi: smileyContractAbi,
  functionName: 'vaults'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link smileyContractAbi}__
 */
export const useWriteSmileyContract = /*#__PURE__*/ createUseWriteContract({
  abi: smileyContractAbi
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteSmileyContractInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: smileyContractAbi,
    functionName: 'initialize'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"liquidateVaultBTC"`
 */
export const useWriteSmileyContractLiquidateVaultBtc =
  /*#__PURE__*/ createUseWriteContract({
    abi: smileyContractAbi,
    functionName: 'liquidateVaultBTC'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"mintFromBTC"`
 */
export const useWriteSmileyContractMintFromBtc =
  /*#__PURE__*/ createUseWriteContract({
    abi: smileyContractAbi,
    functionName: 'mintFromBTC'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"openVault"`
 */
export const useWriteSmileyContractOpenVault =
  /*#__PURE__*/ createUseWriteContract({
    abi: smileyContractAbi,
    functionName: 'openVault'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"openVaultAndMintFromBTC"`
 */
export const useWriteSmileyContractOpenVaultAndMintFromBtc =
  /*#__PURE__*/ createUseWriteContract({
    abi: smileyContractAbi,
    functionName: 'openVaultAndMintFromBTC'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteSmileyContractRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: smileyContractAbi,
    functionName: 'renounceOwnership'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"repayToBTC"`
 */
export const useWriteSmileyContractRepayToBtc =
  /*#__PURE__*/ createUseWriteContract({
    abi: smileyContractAbi,
    functionName: 'repayToBTC'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"setPenalty"`
 */
export const useWriteSmileyContractSetPenalty =
  /*#__PURE__*/ createUseWriteContract({
    abi: smileyContractAbi,
    functionName: 'setPenalty'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"setPenaltyRecipient"`
 */
export const useWriteSmileyContractSetPenaltyRecipient =
  /*#__PURE__*/ createUseWriteContract({
    abi: smileyContractAbi,
    functionName: 'setPenaltyRecipient'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteSmileyContractTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: smileyContractAbi,
    functionName: 'transferOwnership'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"upgradeTo"`
 */
export const useWriteSmileyContractUpgradeTo =
  /*#__PURE__*/ createUseWriteContract({
    abi: smileyContractAbi,
    functionName: 'upgradeTo'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useWriteSmileyContractUpgradeToAndCall =
  /*#__PURE__*/ createUseWriteContract({
    abi: smileyContractAbi,
    functionName: 'upgradeToAndCall'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link smileyContractAbi}__
 */
export const useSimulateSmileyContract =
  /*#__PURE__*/ createUseSimulateContract({ abi: smileyContractAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateSmileyContractInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: smileyContractAbi,
    functionName: 'initialize'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"liquidateVaultBTC"`
 */
export const useSimulateSmileyContractLiquidateVaultBtc =
  /*#__PURE__*/ createUseSimulateContract({
    abi: smileyContractAbi,
    functionName: 'liquidateVaultBTC'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"mintFromBTC"`
 */
export const useSimulateSmileyContractMintFromBtc =
  /*#__PURE__*/ createUseSimulateContract({
    abi: smileyContractAbi,
    functionName: 'mintFromBTC'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"openVault"`
 */
export const useSimulateSmileyContractOpenVault =
  /*#__PURE__*/ createUseSimulateContract({
    abi: smileyContractAbi,
    functionName: 'openVault'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"openVaultAndMintFromBTC"`
 */
export const useSimulateSmileyContractOpenVaultAndMintFromBtc =
  /*#__PURE__*/ createUseSimulateContract({
    abi: smileyContractAbi,
    functionName: 'openVaultAndMintFromBTC'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateSmileyContractRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: smileyContractAbi,
    functionName: 'renounceOwnership'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"repayToBTC"`
 */
export const useSimulateSmileyContractRepayToBtc =
  /*#__PURE__*/ createUseSimulateContract({
    abi: smileyContractAbi,
    functionName: 'repayToBTC'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"setPenalty"`
 */
export const useSimulateSmileyContractSetPenalty =
  /*#__PURE__*/ createUseSimulateContract({
    abi: smileyContractAbi,
    functionName: 'setPenalty'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"setPenaltyRecipient"`
 */
export const useSimulateSmileyContractSetPenaltyRecipient =
  /*#__PURE__*/ createUseSimulateContract({
    abi: smileyContractAbi,
    functionName: 'setPenaltyRecipient'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateSmileyContractTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: smileyContractAbi,
    functionName: 'transferOwnership'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"upgradeTo"`
 */
export const useSimulateSmileyContractUpgradeTo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: smileyContractAbi,
    functionName: 'upgradeTo'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link smileyContractAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useSimulateSmileyContractUpgradeToAndCall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: smileyContractAbi,
    functionName: 'upgradeToAndCall'
  })
