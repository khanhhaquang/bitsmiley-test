import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ZetaConnector
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const zetaConnectorAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'error', inputs: [], name: 'NotSupportMethod' },
  {
    type: 'error',
    inputs: [{ name: '', internalType: 'string', type: 'string' }],
    name: 'OnlySystemContract'
  },
  { type: 'error', inputs: [], name: 'Overflow' },
  { type: 'error', inputs: [], name: 'VaultAlreadyRegistered' },
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
        name: 'liquidator',
        internalType: 'address',
        type: 'address',
        indexed: false
      },
      {
        name: 'lockedCollateral',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'Liquidated'
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
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true
      }
    ],
    name: 'Upgraded'
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
    name: 'bitSmiley',
    outputs: [
      { name: '', internalType: 'contract BitSmileyLike', type: 'address' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    name: 'btc2ethAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'btcZrc20',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'eth2btcAddress',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
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
    inputs: [{ name: '_owner', internalType: 'address', type: 'address' }],
    name: 'getVault',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_vault', internalType: 'address', type: 'address' }],
    name: 'getVaultInfo',
    outputs: [
      {
        name: '',
        internalType: 'struct VaultInfo',
        type: 'tuple',
        components: [
          { name: 'owner', internalType: 'address', type: 'address' },
          { name: 'collateralId', internalType: 'bytes32', type: 'bytes32' }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_btcAddress', internalType: 'bytes', type: 'bytes' }],
    name: 'getVaultInfoByBtc',
    outputs: [
      {
        name: '',
        internalType: 'struct VaultInfo',
        type: 'tuple',
        components: [
          { name: 'owner', internalType: 'address', type: 'address' },
          { name: 'collateralId', internalType: 'bytes32', type: 'bytes32' }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_evmAddress', internalType: 'address', type: 'address' }],
    name: 'getVaultInfoByEvm',
    outputs: [
      {
        name: '',
        internalType: 'struct VaultInfo',
        type: 'tuple',
        components: [
          { name: 'owner', internalType: 'address', type: 'address' },
          { name: 'collateralId', internalType: 'bytes32', type: 'bytes32' }
        ]
      }
    ],
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
      {
        name: '_systemContractAddress',
        internalType: 'address',
        type: 'address'
      },
      { name: '_bitSmiley', internalType: 'address', type: 'address' },
      { name: '_signatureUtil', internalType: 'address', type: 'address' },
      { name: '_btcZrc20', internalType: 'address', type: 'address' }
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: 'collateral', internalType: 'int256', type: 'int256' },
      { name: 'vault', internalType: 'address', type: 'address' },
      { name: 'debt', internalType: 'int256', type: 'int256' }
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'context',
        internalType: 'struct zContext',
        type: 'tuple',
        components: [
          { name: 'origin', internalType: 'bytes', type: 'bytes' },
          { name: 'sender', internalType: 'address', type: 'address' },
          { name: 'chainID', internalType: 'uint256', type: 'uint256' }
        ]
      },
      { name: 'zrc20', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'message', internalType: 'bytes', type: 'bytes' }
    ],
    name: 'onCrossChainCall',
    outputs: [],
    stateMutability: 'nonpayable'
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
      { name: 'collateral', internalType: 'int256', type: 'int256' },
      { name: 'vault', internalType: 'address', type: 'address' },
      { name: 'debt', internalType: 'int256', type: 'int256' }
    ],
    name: 'repay',
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
    inputs: [{ name: '_btcZrc20', internalType: 'address', type: 'address' }],
    name: 'setBtcZrc20',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'signatureUtil',
    outputs: [
      { name: '', internalType: 'contract ISignatureUtil', type: 'address' }
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
    name: 'systemContract',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
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
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zetaConnectorAbi}__
 */
export const useReadZetaConnector = /*#__PURE__*/ createUseReadContract({
  abi: zetaConnectorAbi
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`
 */
export const useReadZetaConnectorDefaultAdminRole =
  /*#__PURE__*/ createUseReadContract({
    abi: zetaConnectorAbi,
    functionName: 'DEFAULT_ADMIN_ROLE'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"bitSmiley"`
 */
export const useReadZetaConnectorBitSmiley =
  /*#__PURE__*/ createUseReadContract({
    abi: zetaConnectorAbi,
    functionName: 'bitSmiley'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"btc2ethAddress"`
 */
export const useReadZetaConnectorBtc2ethAddress =
  /*#__PURE__*/ createUseReadContract({
    abi: zetaConnectorAbi,
    functionName: 'btc2ethAddress'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"btcZrc20"`
 */
export const useReadZetaConnectorBtcZrc20 = /*#__PURE__*/ createUseReadContract(
  { abi: zetaConnectorAbi, functionName: 'btcZrc20' }
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"eth2btcAddress"`
 */
export const useReadZetaConnectorEth2btcAddress =
  /*#__PURE__*/ createUseReadContract({
    abi: zetaConnectorAbi,
    functionName: 'eth2btcAddress'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"getRoleAdmin"`
 */
export const useReadZetaConnectorGetRoleAdmin =
  /*#__PURE__*/ createUseReadContract({
    abi: zetaConnectorAbi,
    functionName: 'getRoleAdmin'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"getVault"`
 */
export const useReadZetaConnectorGetVault = /*#__PURE__*/ createUseReadContract(
  { abi: zetaConnectorAbi, functionName: 'getVault' }
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"getVaultInfo"`
 */
export const useReadZetaConnectorGetVaultInfo =
  /*#__PURE__*/ createUseReadContract({
    abi: zetaConnectorAbi,
    functionName: 'getVaultInfo'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"getVaultInfoByBtc"`
 */
export const useReadZetaConnectorGetVaultInfoByBtc =
  /*#__PURE__*/ createUseReadContract({
    abi: zetaConnectorAbi,
    functionName: 'getVaultInfoByBtc'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"getVaultInfoByEvm"`
 */
export const useReadZetaConnectorGetVaultInfoByEvm =
  /*#__PURE__*/ createUseReadContract({
    abi: zetaConnectorAbi,
    functionName: 'getVaultInfoByEvm'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"hasRole"`
 */
export const useReadZetaConnectorHasRole = /*#__PURE__*/ createUseReadContract({
  abi: zetaConnectorAbi,
  functionName: 'hasRole'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"proxiableUUID"`
 */
export const useReadZetaConnectorProxiableUuid =
  /*#__PURE__*/ createUseReadContract({
    abi: zetaConnectorAbi,
    functionName: 'proxiableUUID'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"signatureUtil"`
 */
export const useReadZetaConnectorSignatureUtil =
  /*#__PURE__*/ createUseReadContract({
    abi: zetaConnectorAbi,
    functionName: 'signatureUtil'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadZetaConnectorSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: zetaConnectorAbi,
    functionName: 'supportsInterface'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"systemContract"`
 */
export const useReadZetaConnectorSystemContract =
  /*#__PURE__*/ createUseReadContract({
    abi: zetaConnectorAbi,
    functionName: 'systemContract'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zetaConnectorAbi}__
 */
export const useWriteZetaConnector = /*#__PURE__*/ createUseWriteContract({
  abi: zetaConnectorAbi
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"grantRole"`
 */
export const useWriteZetaConnectorGrantRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: zetaConnectorAbi,
    functionName: 'grantRole'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteZetaConnectorInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: zetaConnectorAbi,
    functionName: 'initialize'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteZetaConnectorMint = /*#__PURE__*/ createUseWriteContract({
  abi: zetaConnectorAbi,
  functionName: 'mint'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"onCrossChainCall"`
 */
export const useWriteZetaConnectorOnCrossChainCall =
  /*#__PURE__*/ createUseWriteContract({
    abi: zetaConnectorAbi,
    functionName: 'onCrossChainCall'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useWriteZetaConnectorRenounceRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: zetaConnectorAbi,
    functionName: 'renounceRole'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"repay"`
 */
export const useWriteZetaConnectorRepay = /*#__PURE__*/ createUseWriteContract({
  abi: zetaConnectorAbi,
  functionName: 'repay'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useWriteZetaConnectorRevokeRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: zetaConnectorAbi,
    functionName: 'revokeRole'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"setBtcZrc20"`
 */
export const useWriteZetaConnectorSetBtcZrc20 =
  /*#__PURE__*/ createUseWriteContract({
    abi: zetaConnectorAbi,
    functionName: 'setBtcZrc20'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"upgradeTo"`
 */
export const useWriteZetaConnectorUpgradeTo =
  /*#__PURE__*/ createUseWriteContract({
    abi: zetaConnectorAbi,
    functionName: 'upgradeTo'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useWriteZetaConnectorUpgradeToAndCall =
  /*#__PURE__*/ createUseWriteContract({
    abi: zetaConnectorAbi,
    functionName: 'upgradeToAndCall'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zetaConnectorAbi}__
 */
export const useSimulateZetaConnector = /*#__PURE__*/ createUseSimulateContract(
  { abi: zetaConnectorAbi }
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"grantRole"`
 */
export const useSimulateZetaConnectorGrantRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zetaConnectorAbi,
    functionName: 'grantRole'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateZetaConnectorInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zetaConnectorAbi,
    functionName: 'initialize'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateZetaConnectorMint =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zetaConnectorAbi,
    functionName: 'mint'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"onCrossChainCall"`
 */
export const useSimulateZetaConnectorOnCrossChainCall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zetaConnectorAbi,
    functionName: 'onCrossChainCall'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useSimulateZetaConnectorRenounceRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zetaConnectorAbi,
    functionName: 'renounceRole'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"repay"`
 */
export const useSimulateZetaConnectorRepay =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zetaConnectorAbi,
    functionName: 'repay'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useSimulateZetaConnectorRevokeRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zetaConnectorAbi,
    functionName: 'revokeRole'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"setBtcZrc20"`
 */
export const useSimulateZetaConnectorSetBtcZrc20 =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zetaConnectorAbi,
    functionName: 'setBtcZrc20'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"upgradeTo"`
 */
export const useSimulateZetaConnectorUpgradeTo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zetaConnectorAbi,
    functionName: 'upgradeTo'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link zetaConnectorAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useSimulateZetaConnectorUpgradeToAndCall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: zetaConnectorAbi,
    functionName: 'upgradeToAndCall'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link zetaConnectorAbi}__
 */
export const useWatchZetaConnectorEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: zetaConnectorAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link zetaConnectorAbi}__ and `eventName` set to `"AdminChanged"`
 */
export const useWatchZetaConnectorAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: zetaConnectorAbi,
    eventName: 'AdminChanged'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link zetaConnectorAbi}__ and `eventName` set to `"BeaconUpgraded"`
 */
export const useWatchZetaConnectorBeaconUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: zetaConnectorAbi,
    eventName: 'BeaconUpgraded'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link zetaConnectorAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchZetaConnectorInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: zetaConnectorAbi,
    eventName: 'Initialized'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link zetaConnectorAbi}__ and `eventName` set to `"Liquidated"`
 */
export const useWatchZetaConnectorLiquidatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: zetaConnectorAbi,
    eventName: 'Liquidated'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link zetaConnectorAbi}__ and `eventName` set to `"RoleAdminChanged"`
 */
export const useWatchZetaConnectorRoleAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: zetaConnectorAbi,
    eventName: 'RoleAdminChanged'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link zetaConnectorAbi}__ and `eventName` set to `"RoleGranted"`
 */
export const useWatchZetaConnectorRoleGrantedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: zetaConnectorAbi,
    eventName: 'RoleGranted'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link zetaConnectorAbi}__ and `eventName` set to `"RoleRevoked"`
 */
export const useWatchZetaConnectorRoleRevokedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: zetaConnectorAbi,
    eventName: 'RoleRevoked'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link zetaConnectorAbi}__ and `eventName` set to `"Upgraded"`
 */
export const useWatchZetaConnectorUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: zetaConnectorAbi,
    eventName: 'Upgraded'
  })
