import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// vaultManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const vaultManagerAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'error', inputs: [], name: 'AlreadyInitialized' },
  { type: 'error', inputs: [], name: 'BelowMinDebt' },
  { type: 'error', inputs: [], name: 'DebtCeilingExceeded' },
  { type: 'error', inputs: [], name: 'InvalidValue' },
  { type: 'error', inputs: [], name: 'NotAuthorized' },
  { type: 'error', inputs: [], name: 'NotInitialized' },
  { type: 'error', inputs: [], name: 'UnsafeRate' },
  { type: 'error', inputs: [], name: 'VaultDebtLimitReached' },
  { type: 'error', inputs: [], name: 'VaultPositionNotSafe' },
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
      {
        name: 'collateral',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false
      },
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
    name: 'CollateralParameterUpdated'
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
    name: 'SystemParameterUpdated'
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
    name: 'G',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'R',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_collateralId', internalType: 'bytes32', type: 'bytes32' },
      { name: '_vaultAddr', internalType: 'address', type: 'address' },
      { name: '_collateral', internalType: 'int256', type: 'int256' },
      { name: '_bitUSD', internalType: 'int256', type: 'int256' }
    ],
    name: 'calculate',
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
    inputs: [
      { name: '_collateralId', internalType: 'bytes32', type: 'bytes32' }
    ],
    name: 'collateralToken',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    name: 'collateralTypes',
    outputs: [
      { name: 'tokenAddress', internalType: 'address', type: 'address' },
      { name: 'safetyFactor', internalType: 'uint256', type: 'uint256' },
      { name: 'rate', internalType: 'uint256', type: 'uint256' },
      { name: 'totalDebt', internalType: 'uint256', type: 'uint256' },
      { name: 'totalLocked', internalType: 'uint256', type: 'uint256' },
      { name: 'vaultMaxDebt', internalType: 'uint256', type: 'uint256' },
      { name: 'vaultMinDebt', internalType: 'uint256', type: 'uint256' },
      { name: 'maxDebt', internalType: 'uint256', type: 'uint256' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_collateralId', internalType: 'bytes32', type: 'bytes32' },
      { name: '_vaultAddr', internalType: 'address', type: 'address' },
      { name: '_bitUSD', internalType: 'uint256', type: 'uint256' },
      { name: '_collateral', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'confiscate',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'debt',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_collateralId', internalType: 'bytes32', type: 'bytes32' },
      { name: '_vault', internalType: 'address', type: 'address' }
    ],
    name: 'getDebt',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_collateralId', internalType: 'bytes32', type: 'bytes32' },
      { name: '_vaultAddr', internalType: 'address', type: 'address' },
      { name: '_collateral', internalType: 'int256', type: 'int256' },
      { name: '_bitUSD', internalType: 'int256', type: 'int256' },
      { name: '_protectionSafety', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'getVaultChange',
    outputs: [
      {
        name: 'o',
        internalType: 'struct VaultManager.VaultChange',
        type: 'tuple',
        components: [
          {
            name: 'liquidationPrice',
            internalType: 'uint256',
            type: 'uint256'
          },
          { name: 'healthFactor', internalType: 'uint256', type: 'uint256' },
          { name: 'debtBitUSD', internalType: 'uint256', type: 'uint256' },
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
    inputs: [
      { name: '_collateralId', internalType: 'bytes32', type: 'bytes32' },
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_safeFactor', internalType: 'uint256', type: 'uint256' },
      { name: '_maxDebt', internalType: 'uint256', type: 'uint256' },
      { name: '_vaultMinDebt', internalType: 'uint256', type: 'uint256' },
      { name: '_vaultMaxDebt', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'initCollateral',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_oracle', internalType: 'address', type: 'address' },
      { name: '_totalDebtCeiling', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'oracle',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
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
    inputs: [{ name: '_caller', internalType: 'address', type: 'address' }],
    name: 'setCaller',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_id', internalType: 'bytes32', type: 'bytes32' },
      { name: '_maxDebt', internalType: 'uint256', type: 'uint256' },
      { name: '_vaultMinDebt', internalType: 'uint256', type: 'uint256' },
      { name: '_vaultMaxDebt', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'setCollateralDebtCaps',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_collateralId', internalType: 'bytes32', type: 'bytes32' },
      { name: '_v', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'setCollateralSafetyFactor',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_collateralId', internalType: 'bytes32', type: 'bytes32' },
      { name: '_v', internalType: 'address', type: 'address' }
    ],
    name: 'setCollateralToken',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '_oracle', internalType: 'address', type: 'address' }],
    name: 'setOracle',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '_v', internalType: 'uint256', type: 'uint256' }],
    name: 'setTotalDebtCeiling',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalDebtCeiling',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
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
    inputs: [
      { name: '_collateralId', internalType: 'bytes32', type: 'bytes32' },
      { name: '_vault', internalType: 'address', type: 'address' }
    ],
    name: 'vaultPosition',
    outputs: [
      { name: 'isSafe', internalType: 'bool', type: 'bool' },
      {
        name: 'vault',
        internalType: 'struct IVaultManager.Vault',
        type: 'tuple',
        components: [
          {
            name: 'lockedCollateral',
            internalType: 'uint256',
            type: 'uint256'
          },
          { name: 'debtBitUSD', internalType: 'uint256', type: 'uint256' }
        ]
      }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32' },
      { name: '', internalType: 'address', type: 'address' }
    ],
    name: 'vaults',
    outputs: [
      { name: 'lockedCollateral', internalType: 'uint256', type: 'uint256' },
      { name: 'debtBitUSD', internalType: 'uint256', type: 'uint256' }
    ],
    stateMutability: 'view'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultManagerAbi}__
 */
export const useReadVaultManager = /*#__PURE__*/ createUseReadContract({
  abi: vaultManagerAbi
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"G"`
 */
export const useReadVaultManagerG = /*#__PURE__*/ createUseReadContract({
  abi: vaultManagerAbi,
  functionName: 'G'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"R"`
 */
export const useReadVaultManagerR = /*#__PURE__*/ createUseReadContract({
  abi: vaultManagerAbi,
  functionName: 'R'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"caller"`
 */
export const useReadVaultManagerCaller = /*#__PURE__*/ createUseReadContract({
  abi: vaultManagerAbi,
  functionName: 'caller'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"collateralToken"`
 */
export const useReadVaultManagerCollateralToken =
  /*#__PURE__*/ createUseReadContract({
    abi: vaultManagerAbi,
    functionName: 'collateralToken'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"collateralTypes"`
 */
export const useReadVaultManagerCollateralTypes =
  /*#__PURE__*/ createUseReadContract({
    abi: vaultManagerAbi,
    functionName: 'collateralTypes'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"debt"`
 */
export const useReadVaultManagerDebt = /*#__PURE__*/ createUseReadContract({
  abi: vaultManagerAbi,
  functionName: 'debt'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"getDebt"`
 */
export const useReadVaultManagerGetDebt = /*#__PURE__*/ createUseReadContract({
  abi: vaultManagerAbi,
  functionName: 'getDebt'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"getVaultChange"`
 */
export const useReadVaultManagerGetVaultChange =
  /*#__PURE__*/ createUseReadContract({
    abi: vaultManagerAbi,
    functionName: 'getVaultChange'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"oracle"`
 */
export const useReadVaultManagerOracle = /*#__PURE__*/ createUseReadContract({
  abi: vaultManagerAbi,
  functionName: 'oracle'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"owner"`
 */
export const useReadVaultManagerOwner = /*#__PURE__*/ createUseReadContract({
  abi: vaultManagerAbi,
  functionName: 'owner'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"proxiableUUID"`
 */
export const useReadVaultManagerProxiableUuid =
  /*#__PURE__*/ createUseReadContract({
    abi: vaultManagerAbi,
    functionName: 'proxiableUUID'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"totalDebtCeiling"`
 */
export const useReadVaultManagerTotalDebtCeiling =
  /*#__PURE__*/ createUseReadContract({
    abi: vaultManagerAbi,
    functionName: 'totalDebtCeiling'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"vaultPosition"`
 */
export const useReadVaultManagerVaultPosition =
  /*#__PURE__*/ createUseReadContract({
    abi: vaultManagerAbi,
    functionName: 'vaultPosition'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"vaults"`
 */
export const useReadVaultManagerVaults = /*#__PURE__*/ createUseReadContract({
  abi: vaultManagerAbi,
  functionName: 'vaults'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultManagerAbi}__
 */
export const useWriteVaultManager = /*#__PURE__*/ createUseWriteContract({
  abi: vaultManagerAbi
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"calculate"`
 */
export const useWriteVaultManagerCalculate =
  /*#__PURE__*/ createUseWriteContract({
    abi: vaultManagerAbi,
    functionName: 'calculate'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"confiscate"`
 */
export const useWriteVaultManagerConfiscate =
  /*#__PURE__*/ createUseWriteContract({
    abi: vaultManagerAbi,
    functionName: 'confiscate'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"initCollateral"`
 */
export const useWriteVaultManagerInitCollateral =
  /*#__PURE__*/ createUseWriteContract({
    abi: vaultManagerAbi,
    functionName: 'initCollateral'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteVaultManagerInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: vaultManagerAbi,
    functionName: 'initialize'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteVaultManagerRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: vaultManagerAbi,
    functionName: 'renounceOwnership'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"setCaller"`
 */
export const useWriteVaultManagerSetCaller =
  /*#__PURE__*/ createUseWriteContract({
    abi: vaultManagerAbi,
    functionName: 'setCaller'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"setCollateralDebtCaps"`
 */
export const useWriteVaultManagerSetCollateralDebtCaps =
  /*#__PURE__*/ createUseWriteContract({
    abi: vaultManagerAbi,
    functionName: 'setCollateralDebtCaps'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"setCollateralSafetyFactor"`
 */
export const useWriteVaultManagerSetCollateralSafetyFactor =
  /*#__PURE__*/ createUseWriteContract({
    abi: vaultManagerAbi,
    functionName: 'setCollateralSafetyFactor'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"setCollateralToken"`
 */
export const useWriteVaultManagerSetCollateralToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: vaultManagerAbi,
    functionName: 'setCollateralToken'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"setOracle"`
 */
export const useWriteVaultManagerSetOracle =
  /*#__PURE__*/ createUseWriteContract({
    abi: vaultManagerAbi,
    functionName: 'setOracle'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"setTotalDebtCeiling"`
 */
export const useWriteVaultManagerSetTotalDebtCeiling =
  /*#__PURE__*/ createUseWriteContract({
    abi: vaultManagerAbi,
    functionName: 'setTotalDebtCeiling'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteVaultManagerTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: vaultManagerAbi,
    functionName: 'transferOwnership'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"upgradeTo"`
 */
export const useWriteVaultManagerUpgradeTo =
  /*#__PURE__*/ createUseWriteContract({
    abi: vaultManagerAbi,
    functionName: 'upgradeTo'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useWriteVaultManagerUpgradeToAndCall =
  /*#__PURE__*/ createUseWriteContract({
    abi: vaultManagerAbi,
    functionName: 'upgradeToAndCall'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultManagerAbi}__
 */
export const useSimulateVaultManager = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultManagerAbi
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"calculate"`
 */
export const useSimulateVaultManagerCalculate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultManagerAbi,
    functionName: 'calculate'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"confiscate"`
 */
export const useSimulateVaultManagerConfiscate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultManagerAbi,
    functionName: 'confiscate'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"initCollateral"`
 */
export const useSimulateVaultManagerInitCollateral =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultManagerAbi,
    functionName: 'initCollateral'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateVaultManagerInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultManagerAbi,
    functionName: 'initialize'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateVaultManagerRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultManagerAbi,
    functionName: 'renounceOwnership'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"setCaller"`
 */
export const useSimulateVaultManagerSetCaller =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultManagerAbi,
    functionName: 'setCaller'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"setCollateralDebtCaps"`
 */
export const useSimulateVaultManagerSetCollateralDebtCaps =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultManagerAbi,
    functionName: 'setCollateralDebtCaps'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"setCollateralSafetyFactor"`
 */
export const useSimulateVaultManagerSetCollateralSafetyFactor =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultManagerAbi,
    functionName: 'setCollateralSafetyFactor'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"setCollateralToken"`
 */
export const useSimulateVaultManagerSetCollateralToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultManagerAbi,
    functionName: 'setCollateralToken'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"setOracle"`
 */
export const useSimulateVaultManagerSetOracle =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultManagerAbi,
    functionName: 'setOracle'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"setTotalDebtCeiling"`
 */
export const useSimulateVaultManagerSetTotalDebtCeiling =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultManagerAbi,
    functionName: 'setTotalDebtCeiling'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateVaultManagerTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultManagerAbi,
    functionName: 'transferOwnership'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"upgradeTo"`
 */
export const useSimulateVaultManagerUpgradeTo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultManagerAbi,
    functionName: 'upgradeTo'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useSimulateVaultManagerUpgradeToAndCall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultManagerAbi,
    functionName: 'upgradeToAndCall'
  })
