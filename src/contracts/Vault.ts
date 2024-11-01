import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Vault
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const vaultAbi = [
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__
 */
export const useReadVault = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"G"`
 */
export const useReadVaultG = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'G'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"R"`
 */
export const useReadVaultR = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'R'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"caller"`
 */
export const useReadVaultCaller = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'caller'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"collateralToken"`
 */
export const useReadVaultCollateralToken = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'collateralToken'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"collateralTypes"`
 */
export const useReadVaultCollateralTypes = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'collateralTypes'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"debt"`
 */
export const useReadVaultDebt = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'debt'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"getDebt"`
 */
export const useReadVaultGetDebt = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'getDebt'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"getVaultChange"`
 */
export const useReadVaultGetVaultChange = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'getVaultChange'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"oracle"`
 */
export const useReadVaultOracle = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'oracle'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"owner"`
 */
export const useReadVaultOwner = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'owner'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"proxiableUUID"`
 */
export const useReadVaultProxiableUuid = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'proxiableUUID'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"totalDebtCeiling"`
 */
export const useReadVaultTotalDebtCeiling = /*#__PURE__*/ createUseReadContract(
  { abi: vaultAbi, functionName: 'totalDebtCeiling' }
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"vaultPosition"`
 */
export const useReadVaultVaultPosition = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'vaultPosition'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"vaults"`
 */
export const useReadVaultVaults = /*#__PURE__*/ createUseReadContract({
  abi: vaultAbi,
  functionName: 'vaults'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__
 */
export const useWriteVault = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"calculate"`
 */
export const useWriteVaultCalculate = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'calculate'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"confiscate"`
 */
export const useWriteVaultConfiscate = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'confiscate'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"initCollateral"`
 */
export const useWriteVaultInitCollateral = /*#__PURE__*/ createUseWriteContract(
  { abi: vaultAbi, functionName: 'initCollateral' }
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteVaultInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'initialize'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteVaultRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: vaultAbi,
    functionName: 'renounceOwnership'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setCaller"`
 */
export const useWriteVaultSetCaller = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'setCaller'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setCollateralDebtCaps"`
 */
export const useWriteVaultSetCollateralDebtCaps =
  /*#__PURE__*/ createUseWriteContract({
    abi: vaultAbi,
    functionName: 'setCollateralDebtCaps'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setCollateralSafetyFactor"`
 */
export const useWriteVaultSetCollateralSafetyFactor =
  /*#__PURE__*/ createUseWriteContract({
    abi: vaultAbi,
    functionName: 'setCollateralSafetyFactor'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setCollateralToken"`
 */
export const useWriteVaultSetCollateralToken =
  /*#__PURE__*/ createUseWriteContract({
    abi: vaultAbi,
    functionName: 'setCollateralToken'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setOracle"`
 */
export const useWriteVaultSetOracle = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'setOracle'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setTotalDebtCeiling"`
 */
export const useWriteVaultSetTotalDebtCeiling =
  /*#__PURE__*/ createUseWriteContract({
    abi: vaultAbi,
    functionName: 'setTotalDebtCeiling'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteVaultTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: vaultAbi,
    functionName: 'transferOwnership'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"upgradeTo"`
 */
export const useWriteVaultUpgradeTo = /*#__PURE__*/ createUseWriteContract({
  abi: vaultAbi,
  functionName: 'upgradeTo'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useWriteVaultUpgradeToAndCall =
  /*#__PURE__*/ createUseWriteContract({
    abi: vaultAbi,
    functionName: 'upgradeToAndCall'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__
 */
export const useSimulateVault = /*#__PURE__*/ createUseSimulateContract({
  abi: vaultAbi
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"calculate"`
 */
export const useSimulateVaultCalculate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultAbi,
    functionName: 'calculate'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"confiscate"`
 */
export const useSimulateVaultConfiscate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultAbi,
    functionName: 'confiscate'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"initCollateral"`
 */
export const useSimulateVaultInitCollateral =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultAbi,
    functionName: 'initCollateral'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateVaultInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultAbi,
    functionName: 'initialize'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateVaultRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultAbi,
    functionName: 'renounceOwnership'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setCaller"`
 */
export const useSimulateVaultSetCaller =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultAbi,
    functionName: 'setCaller'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setCollateralDebtCaps"`
 */
export const useSimulateVaultSetCollateralDebtCaps =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultAbi,
    functionName: 'setCollateralDebtCaps'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setCollateralSafetyFactor"`
 */
export const useSimulateVaultSetCollateralSafetyFactor =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultAbi,
    functionName: 'setCollateralSafetyFactor'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setCollateralToken"`
 */
export const useSimulateVaultSetCollateralToken =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultAbi,
    functionName: 'setCollateralToken'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setOracle"`
 */
export const useSimulateVaultSetOracle =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultAbi,
    functionName: 'setOracle'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"setTotalDebtCeiling"`
 */
export const useSimulateVaultSetTotalDebtCeiling =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultAbi,
    functionName: 'setTotalDebtCeiling'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateVaultTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultAbi,
    functionName: 'transferOwnership'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"upgradeTo"`
 */
export const useSimulateVaultUpgradeTo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultAbi,
    functionName: 'upgradeTo'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useSimulateVaultUpgradeToAndCall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultAbi,
    functionName: 'upgradeToAndCall'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__
 */
export const useWatchVaultEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: vaultAbi
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__ and `eventName` set to `"AdminChanged"`
 */
export const useWatchVaultAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: vaultAbi,
    eventName: 'AdminChanged'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__ and `eventName` set to `"BeaconUpgraded"`
 */
export const useWatchVaultBeaconUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: vaultAbi,
    eventName: 'BeaconUpgraded'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__ and `eventName` set to `"CollateralParameterUpdated"`
 */
export const useWatchVaultCollateralParameterUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: vaultAbi,
    eventName: 'CollateralParameterUpdated'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchVaultInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: vaultAbi,
    eventName: 'Initialized'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchVaultOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: vaultAbi,
    eventName: 'OwnershipTransferred'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__ and `eventName` set to `"SystemParameterUpdated"`
 */
export const useWatchVaultSystemParameterUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: vaultAbi,
    eventName: 'SystemParameterUpdated'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultAbi}__ and `eventName` set to `"Upgraded"`
 */
export const useWatchVaultUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: vaultAbi,
    eventName: 'Upgraded'
  })
