import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// vaultManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const vaultManagerAbi = [
  { type: 'error', inputs: [], name: 'BelowMinDebt' },
  { type: 'error', inputs: [], name: 'CollateralNotInitialized' },
  { type: 'error', inputs: [], name: 'DebtCeilingExceeded' },
  { type: 'error', inputs: [], name: 'DivideByZero' },
  { type: 'error', inputs: [], name: 'NotAuthorized' },
  { type: 'error', inputs: [], name: 'UnsafeRate' },
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
        name: 'previousCaller',
        internalType: 'address',
        type: 'address',
        indexed: false
      },
      {
        name: 'currentCaller',
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
    inputs: [{ name: '_operator', internalType: 'address', type: 'address' }],
    name: 'approveOperator',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_collateralId', internalType: 'bytes32', type: 'bytes32' },
      { name: '_vaultAddr', internalType: 'address', type: 'address' },
      { name: '_collateralProvider', internalType: 'address', type: 'address' },
      { name: '_debtOwner', internalType: 'address', type: 'address' },
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
      { name: 'maxDebt', internalType: 'uint256', type: 'uint256' },
      { name: 'minDebt', internalType: 'uint256', type: 'uint256' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'bytes32', type: 'bytes32' },
      { name: '', internalType: 'address', type: 'address' }
    ],
    name: 'credit',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
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
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'eligible',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_collateralId', internalType: 'bytes32', type: 'bytes32' },
      { name: '_collateral', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'evaluateCollateral',
    outputs: [
      {
        name: 'collateralEvaluation',
        internalType: 'uint256',
        type: 'uint256'
      }
    ],
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
        internalType: 'struct VaultManager.VaultOverview',
        type: 'tuple',
        components: [
          {
            name: 'liquidationPrice',
            internalType: 'uint256',
            type: 'uint256'
          },
          { name: 'collateralRate', internalType: 'uint256', type: 'uint256' },
          { name: 'debtBitUSD', internalType: 'uint256', type: 'uint256' },
          {
            name: 'lockedCollateral',
            internalType: 'uint256',
            type: 'uint256'
          },
          {
            name: 'availableToWithdraw',
            internalType: 'uint256',
            type: 'uint256'
          },
          { name: 'availableToMint', internalType: 'uint256', type: 'uint256' }
        ]
      }
    ],
    stateMutability: 'view'
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
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' }
    ],
    name: 'operators',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
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
      { name: '_collateralId', internalType: 'bytes32', type: 'bytes32' },
      { name: '_tokenAddress', internalType: 'address', type: 'address' },
      { name: '_safetyFactor', internalType: 'uint256', type: 'uint256' },
      { name: '_maxDebt', internalType: 'uint256', type: 'uint256' },
      { name: '_minDebt', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'setCollateral',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_collateralId', internalType: 'bytes32', type: 'bytes32' },
      { name: '_maxDebt', internalType: 'uint256', type: 'uint256' },
      { name: '_minDebt', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'setCollateralLevels',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_collateralId', internalType: 'bytes32', type: 'bytes32' },
      { name: '_safetyFactor', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'setCollateralSafetyFactor',
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
    inputs: [
      { name: '_totalDebtCeiling', internalType: 'uint256', type: 'uint256' }
    ],
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
    inputs: [
      { name: '_from', internalType: 'address', type: 'address' },
      { name: '_to', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'int256', type: 'int256' }
    ],
    name: 'transferEligible',
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
      { name: '_collateralId', internalType: 'bytes32', type: 'bytes32' },
      { name: '_vault', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'int256', type: 'int256' }
    ],
    name: 'updateCredits',
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
      { name: 'bitUSDEvaluation', internalType: 'uint256', type: 'uint256' },
      { name: 'lockedCollateral', internalType: 'uint256', type: 'uint256' },
      {
        name: 'collateralEvaluation',
        internalType: 'uint256',
        type: 'uint256'
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"credit"`
 */
export const useReadVaultManagerCredit = /*#__PURE__*/ createUseReadContract({
  abi: vaultManagerAbi,
  functionName: 'credit'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"debt"`
 */
export const useReadVaultManagerDebt = /*#__PURE__*/ createUseReadContract({
  abi: vaultManagerAbi,
  functionName: 'debt'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"eligible"`
 */
export const useReadVaultManagerEligible = /*#__PURE__*/ createUseReadContract({
  abi: vaultManagerAbi,
  functionName: 'eligible'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"evaluateCollateral"`
 */
export const useReadVaultManagerEvaluateCollateral =
  /*#__PURE__*/ createUseReadContract({
    abi: vaultManagerAbi,
    functionName: 'evaluateCollateral'
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"operators"`
 */
export const useReadVaultManagerOperators = /*#__PURE__*/ createUseReadContract(
  { abi: vaultManagerAbi, functionName: 'operators' }
)

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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"paused"`
 */
export const useReadVaultManagerPaused = /*#__PURE__*/ createUseReadContract({
  abi: vaultManagerAbi,
  functionName: 'paused'
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
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"approveOperator"`
 */
export const useWriteVaultManagerApproveOperator =
  /*#__PURE__*/ createUseWriteContract({
    abi: vaultManagerAbi,
    functionName: 'approveOperator'
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
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"setCollateral"`
 */
export const useWriteVaultManagerSetCollateral =
  /*#__PURE__*/ createUseWriteContract({
    abi: vaultManagerAbi,
    functionName: 'setCollateral'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"setCollateralLevels"`
 */
export const useWriteVaultManagerSetCollateralLevels =
  /*#__PURE__*/ createUseWriteContract({
    abi: vaultManagerAbi,
    functionName: 'setCollateralLevels'
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
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"transferEligible"`
 */
export const useWriteVaultManagerTransferEligible =
  /*#__PURE__*/ createUseWriteContract({
    abi: vaultManagerAbi,
    functionName: 'transferEligible'
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
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"updateCredits"`
 */
export const useWriteVaultManagerUpdateCredits =
  /*#__PURE__*/ createUseWriteContract({
    abi: vaultManagerAbi,
    functionName: 'updateCredits'
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
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"approveOperator"`
 */
export const useSimulateVaultManagerApproveOperator =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultManagerAbi,
    functionName: 'approveOperator'
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
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"setCollateral"`
 */
export const useSimulateVaultManagerSetCollateral =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultManagerAbi,
    functionName: 'setCollateral'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"setCollateralLevels"`
 */
export const useSimulateVaultManagerSetCollateralLevels =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultManagerAbi,
    functionName: 'setCollateralLevels'
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
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"transferEligible"`
 */
export const useSimulateVaultManagerTransferEligible =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultManagerAbi,
    functionName: 'transferEligible'
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
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link vaultManagerAbi}__ and `functionName` set to `"updateCredits"`
 */
export const useSimulateVaultManagerUpdateCredits =
  /*#__PURE__*/ createUseSimulateContract({
    abi: vaultManagerAbi,
    functionName: 'updateCredits'
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

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultManagerAbi}__
 */
export const useWatchVaultManagerEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: vaultManagerAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultManagerAbi}__ and `eventName` set to `"AdminChanged"`
 */
export const useWatchVaultManagerAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: vaultManagerAbi,
    eventName: 'AdminChanged'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultManagerAbi}__ and `eventName` set to `"BeaconUpgraded"`
 */
export const useWatchVaultManagerBeaconUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: vaultManagerAbi,
    eventName: 'BeaconUpgraded'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultManagerAbi}__ and `eventName` set to `"CallerUpdated"`
 */
export const useWatchVaultManagerCallerUpdatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: vaultManagerAbi,
    eventName: 'CallerUpdated'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultManagerAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchVaultManagerInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: vaultManagerAbi,
    eventName: 'Initialized'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultManagerAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchVaultManagerOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: vaultManagerAbi,
    eventName: 'OwnershipTransferred'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultManagerAbi}__ and `eventName` set to `"Paused"`
 */
export const useWatchVaultManagerPausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: vaultManagerAbi,
    eventName: 'Paused'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultManagerAbi}__ and `eventName` set to `"Unpaused"`
 */
export const useWatchVaultManagerUnpausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: vaultManagerAbi,
    eventName: 'Unpaused'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link vaultManagerAbi}__ and `eventName` set to `"Upgraded"`
 */
export const useWatchVaultManagerUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: vaultManagerAbi,
    eventName: 'Upgraded'
  })
