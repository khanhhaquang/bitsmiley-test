import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BitSmiley
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const bitSmileyAbi = [
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyAbi}__
 */
export const useReadBitSmiley = /*#__PURE__*/ createUseReadContract({
  abi: bitSmileyAbi
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"BTC_COLLATERAL_ID"`
 */
export const useReadBitSmileyBtcCollateralId =
  /*#__PURE__*/ createUseReadContract({
    abi: bitSmileyAbi,
    functionName: 'BTC_COLLATERAL_ID'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"PENALTY_BASE"`
 */
export const useReadBitSmileyPenaltyBase = /*#__PURE__*/ createUseReadContract({
  abi: bitSmileyAbi,
  functionName: 'PENALTY_BASE'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"bitUSD"`
 */
export const useReadBitSmileyBitUsd = /*#__PURE__*/ createUseReadContract({
  abi: bitSmileyAbi,
  functionName: 'bitUSD'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"liquidationPenalty"`
 */
export const useReadBitSmileyLiquidationPenalty =
  /*#__PURE__*/ createUseReadContract({
    abi: bitSmileyAbi,
    functionName: 'liquidationPenalty'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"owner"`
 */
export const useReadBitSmileyOwner = /*#__PURE__*/ createUseReadContract({
  abi: bitSmileyAbi,
  functionName: 'owner'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"owners"`
 */
export const useReadBitSmileyOwners = /*#__PURE__*/ createUseReadContract({
  abi: bitSmileyAbi,
  functionName: 'owners'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"paused"`
 */
export const useReadBitSmileyPaused = /*#__PURE__*/ createUseReadContract({
  abi: bitSmileyAbi,
  functionName: 'paused'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"penaltyRecipient"`
 */
export const useReadBitSmileyPenaltyRecipient =
  /*#__PURE__*/ createUseReadContract({
    abi: bitSmileyAbi,
    functionName: 'penaltyRecipient'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"proxiableUUID"`
 */
export const useReadBitSmileyProxiableUuid =
  /*#__PURE__*/ createUseReadContract({
    abi: bitSmileyAbi,
    functionName: 'proxiableUUID'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"vaultManager"`
 */
export const useReadBitSmileyVaultManager = /*#__PURE__*/ createUseReadContract(
  { abi: bitSmileyAbi, functionName: 'vaultManager' }
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"vaults"`
 */
export const useReadBitSmileyVaults = /*#__PURE__*/ createUseReadContract({
  abi: bitSmileyAbi,
  functionName: 'vaults'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitSmileyAbi}__
 */
export const useWriteBitSmiley = /*#__PURE__*/ createUseWriteContract({
  abi: bitSmileyAbi
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteBitSmileyInitialize = /*#__PURE__*/ createUseWriteContract(
  { abi: bitSmileyAbi, functionName: 'initialize' }
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"liquidateVaultBTC"`
 */
export const useWriteBitSmileyLiquidateVaultBtc =
  /*#__PURE__*/ createUseWriteContract({
    abi: bitSmileyAbi,
    functionName: 'liquidateVaultBTC'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"mintFromBTC"`
 */
export const useWriteBitSmileyMintFromBtc =
  /*#__PURE__*/ createUseWriteContract({
    abi: bitSmileyAbi,
    functionName: 'mintFromBTC'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"openVault"`
 */
export const useWriteBitSmileyOpenVault = /*#__PURE__*/ createUseWriteContract({
  abi: bitSmileyAbi,
  functionName: 'openVault'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"openVaultAndMintFromBTC"`
 */
export const useWriteBitSmileyOpenVaultAndMintFromBtc =
  /*#__PURE__*/ createUseWriteContract({
    abi: bitSmileyAbi,
    functionName: 'openVaultAndMintFromBTC'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteBitSmileyRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: bitSmileyAbi,
    functionName: 'renounceOwnership'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"repayToBTC"`
 */
export const useWriteBitSmileyRepayToBtc = /*#__PURE__*/ createUseWriteContract(
  { abi: bitSmileyAbi, functionName: 'repayToBTC' }
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"setPenalty"`
 */
export const useWriteBitSmileySetPenalty = /*#__PURE__*/ createUseWriteContract(
  { abi: bitSmileyAbi, functionName: 'setPenalty' }
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"setPenaltyRecipient"`
 */
export const useWriteBitSmileySetPenaltyRecipient =
  /*#__PURE__*/ createUseWriteContract({
    abi: bitSmileyAbi,
    functionName: 'setPenaltyRecipient'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteBitSmileyTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: bitSmileyAbi,
    functionName: 'transferOwnership'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"upgradeTo"`
 */
export const useWriteBitSmileyUpgradeTo = /*#__PURE__*/ createUseWriteContract({
  abi: bitSmileyAbi,
  functionName: 'upgradeTo'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useWriteBitSmileyUpgradeToAndCall =
  /*#__PURE__*/ createUseWriteContract({
    abi: bitSmileyAbi,
    functionName: 'upgradeToAndCall'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitSmileyAbi}__
 */
export const useSimulateBitSmiley = /*#__PURE__*/ createUseSimulateContract({
  abi: bitSmileyAbi
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateBitSmileyInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitSmileyAbi,
    functionName: 'initialize'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"liquidateVaultBTC"`
 */
export const useSimulateBitSmileyLiquidateVaultBtc =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitSmileyAbi,
    functionName: 'liquidateVaultBTC'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"mintFromBTC"`
 */
export const useSimulateBitSmileyMintFromBtc =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitSmileyAbi,
    functionName: 'mintFromBTC'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"openVault"`
 */
export const useSimulateBitSmileyOpenVault =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitSmileyAbi,
    functionName: 'openVault'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"openVaultAndMintFromBTC"`
 */
export const useSimulateBitSmileyOpenVaultAndMintFromBtc =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitSmileyAbi,
    functionName: 'openVaultAndMintFromBTC'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateBitSmileyRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitSmileyAbi,
    functionName: 'renounceOwnership'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"repayToBTC"`
 */
export const useSimulateBitSmileyRepayToBtc =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitSmileyAbi,
    functionName: 'repayToBTC'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"setPenalty"`
 */
export const useSimulateBitSmileySetPenalty =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitSmileyAbi,
    functionName: 'setPenalty'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"setPenaltyRecipient"`
 */
export const useSimulateBitSmileySetPenaltyRecipient =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitSmileyAbi,
    functionName: 'setPenaltyRecipient'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateBitSmileyTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitSmileyAbi,
    functionName: 'transferOwnership'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"upgradeTo"`
 */
export const useSimulateBitSmileyUpgradeTo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitSmileyAbi,
    functionName: 'upgradeTo'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useSimulateBitSmileyUpgradeToAndCall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitSmileyAbi,
    functionName: 'upgradeToAndCall'
  })
