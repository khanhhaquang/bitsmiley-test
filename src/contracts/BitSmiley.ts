import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent
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
  { type: 'error', inputs: [], name: 'NotEnoughToCoverFee' },
  { type: 'error', inputs: [], name: 'NotOwner' },
  { type: 'error', inputs: [], name: 'Overflow' },
  { type: 'error', inputs: [], name: 'UnknownParameter' },
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
        name: 'collateralId',
        internalType: 'bytes32',
        type: 'bytes32',
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
      }
    ],
    name: 'Liquidated'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'who', internalType: 'address', type: 'address', indexed: false },
      { name: 'what', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'collateralId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false
      },
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
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'previousAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true
      },
      {
        name: 'newAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true
      }
    ],
    name: 'RoleAdminChanged'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true
      }
    ],
    name: 'RoleGranted'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true
      }
    ],
    name: 'RoleRevoked'
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
        name: 'collateralId',
        internalType: 'bytes32',
        type: 'bytes32',
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
        name: 'collateralId',
        internalType: 'bytes32',
        type: 'bytes32',
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
    name: 'VaultPosChanged'
  },
  {
    type: 'function',
    inputs: [],
    name: 'BITSMILEY_ADMIN',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
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
    inputs: [],
    name: 'feeBeneficiary',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'feeToken',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_collateralId', internalType: 'bytes32', type: 'bytes32' }
    ],
    name: 'getLiquidationFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' }
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' }
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_vaultManager', internalType: 'address', type: 'address' },
      { name: '_beneficiary', internalType: 'address', type: 'address' },
      { name: '_stabilityFee', internalType: 'address', type: 'address' },
      { name: '_feeBeneficiary', internalType: 'address', type: 'address' },
      { name: '_bitSmileyAdmin', internalType: 'address[]', type: 'address[]' }
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '_vault', internalType: 'address', type: 'address' }],
    name: 'liquidate',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'liquidationBeneficiary',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_vault', internalType: 'address', type: 'address' },
      { name: '_bitUSD', internalType: 'int256', type: 'int256' },
      { name: '_collateral', internalType: 'int256', type: 'int256' }
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'payable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_collateralId', internalType: 'bytes32', type: 'bytes32' },
      { name: '_bitUSD', internalType: 'int256', type: 'int256' },
      { name: '_collateral', internalType: 'int256', type: 'int256' }
    ],
    name: 'openVault',
    outputs: [],
    stateMutability: 'payable'
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
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable'
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
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' }
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_vault', internalType: 'address', type: 'address' },
      { name: '_debt', internalType: 'int256', type: 'int256' },
      { name: '_collateral', internalType: 'int256', type: 'int256' }
    ],
    name: 'repay',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_vault', internalType: 'address', type: 'address' },
      { name: '_collateral', internalType: 'int256', type: 'int256' }
    ],
    name: 'repayAll',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' }
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_what', internalType: 'bytes32', type: 'bytes32' },
      { name: '_addr', internalType: 'address', type: 'address' }
    ],
    name: 'setAddress',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_collateralId', internalType: 'bytes32', type: 'bytes32' },
      { name: '_fee', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'setLiquidationFee',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'stabilityFee',
    outputs: [
      { name: '', internalType: 'contract IStabilityFee', type: 'address' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'unpause',
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
    name: 'vaultMinted',
    outputs: [{ name: '', internalType: 'int256', type: 'int256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'vaults',
    outputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'collateralId', internalType: 'bytes32', type: 'bytes32' }
    ],
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"BITSMILEY_ADMIN"`
 */
export const useReadBitSmileyBitsmileyAdmin =
  /*#__PURE__*/ createUseReadContract({
    abi: bitSmileyAbi,
    functionName: 'BITSMILEY_ADMIN'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`
 */
export const useReadBitSmileyDefaultAdminRole =
  /*#__PURE__*/ createUseReadContract({
    abi: bitSmileyAbi,
    functionName: 'DEFAULT_ADMIN_ROLE'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"bitUSD"`
 */
export const useReadBitSmileyBitUsd = /*#__PURE__*/ createUseReadContract({
  abi: bitSmileyAbi,
  functionName: 'bitUSD'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"feeBeneficiary"`
 */
export const useReadBitSmileyFeeBeneficiary =
  /*#__PURE__*/ createUseReadContract({
    abi: bitSmileyAbi,
    functionName: 'feeBeneficiary'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"feeToken"`
 */
export const useReadBitSmileyFeeToken = /*#__PURE__*/ createUseReadContract({
  abi: bitSmileyAbi,
  functionName: 'feeToken'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"getLiquidationFee"`
 */
export const useReadBitSmileyGetLiquidationFee =
  /*#__PURE__*/ createUseReadContract({
    abi: bitSmileyAbi,
    functionName: 'getLiquidationFee'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"getRoleAdmin"`
 */
export const useReadBitSmileyGetRoleAdmin = /*#__PURE__*/ createUseReadContract(
  { abi: bitSmileyAbi, functionName: 'getRoleAdmin' }
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"hasRole"`
 */
export const useReadBitSmileyHasRole = /*#__PURE__*/ createUseReadContract({
  abi: bitSmileyAbi,
  functionName: 'hasRole'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"liquidationBeneficiary"`
 */
export const useReadBitSmileyLiquidationBeneficiary =
  /*#__PURE__*/ createUseReadContract({
    abi: bitSmileyAbi,
    functionName: 'liquidationBeneficiary'
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"proxiableUUID"`
 */
export const useReadBitSmileyProxiableUuid =
  /*#__PURE__*/ createUseReadContract({
    abi: bitSmileyAbi,
    functionName: 'proxiableUUID'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"stabilityFee"`
 */
export const useReadBitSmileyStabilityFee = /*#__PURE__*/ createUseReadContract(
  { abi: bitSmileyAbi, functionName: 'stabilityFee' }
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadBitSmileySupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: bitSmileyAbi,
    functionName: 'supportsInterface'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"vaultManager"`
 */
export const useReadBitSmileyVaultManager = /*#__PURE__*/ createUseReadContract(
  { abi: bitSmileyAbi, functionName: 'vaultManager' }
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"vaultMinted"`
 */
export const useReadBitSmileyVaultMinted = /*#__PURE__*/ createUseReadContract({
  abi: bitSmileyAbi,
  functionName: 'vaultMinted'
})

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
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"grantRole"`
 */
export const useWriteBitSmileyGrantRole = /*#__PURE__*/ createUseWriteContract({
  abi: bitSmileyAbi,
  functionName: 'grantRole'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteBitSmileyInitialize = /*#__PURE__*/ createUseWriteContract(
  { abi: bitSmileyAbi, functionName: 'initialize' }
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"liquidate"`
 */
export const useWriteBitSmileyLiquidate = /*#__PURE__*/ createUseWriteContract({
  abi: bitSmileyAbi,
  functionName: 'liquidate'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteBitSmileyMint = /*#__PURE__*/ createUseWriteContract({
  abi: bitSmileyAbi,
  functionName: 'mint'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"openVault"`
 */
export const useWriteBitSmileyOpenVault = /*#__PURE__*/ createUseWriteContract({
  abi: bitSmileyAbi,
  functionName: 'openVault'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"pause"`
 */
export const useWriteBitSmileyPause = /*#__PURE__*/ createUseWriteContract({
  abi: bitSmileyAbi,
  functionName: 'pause'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useWriteBitSmileyRenounceRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: bitSmileyAbi,
    functionName: 'renounceRole'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"repay"`
 */
export const useWriteBitSmileyRepay = /*#__PURE__*/ createUseWriteContract({
  abi: bitSmileyAbi,
  functionName: 'repay'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"repayAll"`
 */
export const useWriteBitSmileyRepayAll = /*#__PURE__*/ createUseWriteContract({
  abi: bitSmileyAbi,
  functionName: 'repayAll'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useWriteBitSmileyRevokeRole = /*#__PURE__*/ createUseWriteContract(
  { abi: bitSmileyAbi, functionName: 'revokeRole' }
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"setAddress"`
 */
export const useWriteBitSmileySetAddress = /*#__PURE__*/ createUseWriteContract(
  { abi: bitSmileyAbi, functionName: 'setAddress' }
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"setLiquidationFee"`
 */
export const useWriteBitSmileySetLiquidationFee =
  /*#__PURE__*/ createUseWriteContract({
    abi: bitSmileyAbi,
    functionName: 'setLiquidationFee'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"unpause"`
 */
export const useWriteBitSmileyUnpause = /*#__PURE__*/ createUseWriteContract({
  abi: bitSmileyAbi,
  functionName: 'unpause'
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
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"grantRole"`
 */
export const useSimulateBitSmileyGrantRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitSmileyAbi,
    functionName: 'grantRole'
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
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"liquidate"`
 */
export const useSimulateBitSmileyLiquidate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitSmileyAbi,
    functionName: 'liquidate'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateBitSmileyMint = /*#__PURE__*/ createUseSimulateContract(
  { abi: bitSmileyAbi, functionName: 'mint' }
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"openVault"`
 */
export const useSimulateBitSmileyOpenVault =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitSmileyAbi,
    functionName: 'openVault'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"pause"`
 */
export const useSimulateBitSmileyPause =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitSmileyAbi,
    functionName: 'pause'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useSimulateBitSmileyRenounceRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitSmileyAbi,
    functionName: 'renounceRole'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"repay"`
 */
export const useSimulateBitSmileyRepay =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitSmileyAbi,
    functionName: 'repay'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"repayAll"`
 */
export const useSimulateBitSmileyRepayAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitSmileyAbi,
    functionName: 'repayAll'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useSimulateBitSmileyRevokeRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitSmileyAbi,
    functionName: 'revokeRole'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"setAddress"`
 */
export const useSimulateBitSmileySetAddress =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitSmileyAbi,
    functionName: 'setAddress'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"setLiquidationFee"`
 */
export const useSimulateBitSmileySetLiquidationFee =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitSmileyAbi,
    functionName: 'setLiquidationFee'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link bitSmileyAbi}__ and `functionName` set to `"unpause"`
 */
export const useSimulateBitSmileyUnpause =
  /*#__PURE__*/ createUseSimulateContract({
    abi: bitSmileyAbi,
    functionName: 'unpause'
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

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link bitSmileyAbi}__
 */
export const useWatchBitSmileyEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: bitSmileyAbi }
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link bitSmileyAbi}__ and `eventName` set to `"AdminChanged"`
 */
export const useWatchBitSmileyAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: bitSmileyAbi,
    eventName: 'AdminChanged'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link bitSmileyAbi}__ and `eventName` set to `"BeaconUpgraded"`
 */
export const useWatchBitSmileyBeaconUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: bitSmileyAbi,
    eventName: 'BeaconUpgraded'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link bitSmileyAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchBitSmileyInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: bitSmileyAbi,
    eventName: 'Initialized'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link bitSmileyAbi}__ and `eventName` set to `"Liquidated"`
 */
export const useWatchBitSmileyLiquidatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: bitSmileyAbi,
    eventName: 'Liquidated'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link bitSmileyAbi}__ and `eventName` set to `"ParameterUpdated"`
 */
export const useWatchBitSmileyParameterUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: bitSmileyAbi,
    eventName: 'ParameterUpdated'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link bitSmileyAbi}__ and `eventName` set to `"Paused"`
 */
export const useWatchBitSmileyPausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: bitSmileyAbi,
    eventName: 'Paused'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link bitSmileyAbi}__ and `eventName` set to `"RoleAdminChanged"`
 */
export const useWatchBitSmileyRoleAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: bitSmileyAbi,
    eventName: 'RoleAdminChanged'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link bitSmileyAbi}__ and `eventName` set to `"RoleGranted"`
 */
export const useWatchBitSmileyRoleGrantedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: bitSmileyAbi,
    eventName: 'RoleGranted'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link bitSmileyAbi}__ and `eventName` set to `"RoleRevoked"`
 */
export const useWatchBitSmileyRoleRevokedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: bitSmileyAbi,
    eventName: 'RoleRevoked'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link bitSmileyAbi}__ and `eventName` set to `"Unpaused"`
 */
export const useWatchBitSmileyUnpausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: bitSmileyAbi,
    eventName: 'Unpaused'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link bitSmileyAbi}__ and `eventName` set to `"Upgraded"`
 */
export const useWatchBitSmileyUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: bitSmileyAbi,
    eventName: 'Upgraded'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link bitSmileyAbi}__ and `eventName` set to `"VaultOpened"`
 */
export const useWatchBitSmileyVaultOpenedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: bitSmileyAbi,
    eventName: 'VaultOpened'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link bitSmileyAbi}__ and `eventName` set to `"VaultPosChanged"`
 */
export const useWatchBitSmileyVaultPosChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: bitSmileyAbi,
    eventName: 'VaultPosChanged'
  })
