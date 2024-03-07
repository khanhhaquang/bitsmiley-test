export const bitSmileyABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [],
    name: 'AlreadyOpenedVault',
    type: 'error'
  },
  {
    inputs: [],
    name: 'CannotBeLiquidated',
    type: 'error'
  },
  {
    inputs: [],
    name: 'InvalidAmount',
    type: 'error'
  },
  {
    inputs: [],
    name: 'InvalidPenalty',
    type: 'error'
  },
  {
    inputs: [],
    name: 'MsgValueIncorrect',
    type: 'error'
  },
  {
    inputs: [],
    name: 'NotOwner',
    type: 'error'
  },
  {
    inputs: [],
    name: 'VaultNotRegistered',
    type: 'error'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'previousAdmin',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newAdmin',
        type: 'address'
      }
    ],
    name: 'AdminChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'beacon',
        type: 'address'
      }
    ],
    name: 'BeaconUpgraded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8'
      }
    ],
    name: 'Initialized',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'vault',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'collateral',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'bitUSD',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'liquidator',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'penalty',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'recipient',
        type: 'address'
      }
    ],
    name: 'Liquidated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'vault',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'collateral',
        type: 'int256'
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'bitUSD',
        type: 'int256'
      }
    ],
    name: 'Mint',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'what',
        type: 'string'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'previous',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'current',
        type: 'uint256'
      }
    ],
    name: 'ParameterUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'Paused',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'vault',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'collateral',
        type: 'int256'
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'bitUSD',
        type: 'int256'
      }
    ],
    name: 'Repay',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'Unpaused',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address'
      }
    ],
    name: 'Upgraded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'vault',
        type: 'address'
      }
    ],
    name: 'VaultOpened',
    type: 'event'
  },
  {
    inputs: [],
    name: 'BTC_COLLATERAL_ID',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'PENALTY_BASE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'bitUSD',
    outputs: [
      {
        internalType: 'contract IToken',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_vaultManager',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_liquidationPenalty',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: '_penaltyRecipient',
        type: 'address'
      }
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_vault',
        type: 'address'
      }
    ],
    name: 'liquidateVaultBTC',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'liquidationPenalty',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_vault',
        type: 'address'
      },
      {
        internalType: 'int256',
        name: '_bitUSD',
        type: 'int256'
      },
      {
        internalType: 'int256',
        name: '_collateral',
        type: 'int256'
      }
    ],
    name: 'mintFromBTC',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'openVault',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'int256',
        name: '_bitUSD',
        type: 'int256'
      },
      {
        internalType: 'int256',
        name: '_collateral',
        type: 'int256'
      }
    ],
    name: 'openVaultAndMintFromBTC',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'owners',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'penaltyRecipient',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'proxiableUUID',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_vault',
        type: 'address'
      },
      {
        internalType: 'int256',
        name: '_bitUSD',
        type: 'int256'
      },
      {
        internalType: 'int256',
        name: '_collateral',
        type: 'int256'
      }
    ],
    name: 'repayToBTC',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_penalty',
        type: 'uint256'
      }
    ],
    name: 'setPenalty',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_recipient',
        type: 'address'
      }
    ],
    name: 'setPenaltyRecipient',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address'
      }
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address'
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes'
      }
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'vaultManager',
    outputs: [
      {
        internalType: 'contract IVaultManager',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'vaults',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
]

export const bitUSDABI = [
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name_',
        type: 'string'
      },
      {
        internalType: 'string',
        name: 'symbol_',
        type: 'string'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [],
    name: 'AlreadyInitialized',
    type: 'error'
  },
  {
    inputs: [],
    name: 'NotCaller',
    type: 'error'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256'
      }
    ],
    name: 'Approval',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256'
      }
    ],
    name: 'Transfer',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address'
      }
    ],
    name: 'allowance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_recipient',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256'
      }
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'caller',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'subtractedValue',
        type: 'uint256'
      }
    ],
    name: 'decreaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'addedValue',
        type: 'uint256'
      }
    ],
    name: 'increaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_caller',
        type: 'address'
      }
    ],
    name: 'init',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'initialized',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_recipient',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256'
      }
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'transfer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'transferFrom',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  }
]

export const oraclesABI = [
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_collateralId',
        type: 'bytes32'
      }
    ],
    name: 'getPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
]

export const vaultManagerABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [],
    name: 'AlreadyInitialized',
    type: 'error'
  },
  {
    inputs: [],
    name: 'BelowMinDebt',
    type: 'error'
  },
  {
    inputs: [],
    name: 'DebtCeilingExceeded',
    type: 'error'
  },
  {
    inputs: [],
    name: 'InvalidValue',
    type: 'error'
  },
  {
    inputs: [],
    name: 'NotAuthorized',
    type: 'error'
  },
  {
    inputs: [],
    name: 'NotInitialized',
    type: 'error'
  },
  {
    inputs: [],
    name: 'UnsafeRate',
    type: 'error'
  },
  {
    inputs: [],
    name: 'VaultDebtLimitReached',
    type: 'error'
  },
  {
    inputs: [],
    name: 'VaultPositionNotSafe',
    type: 'error'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'previousAdmin',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newAdmin',
        type: 'address'
      }
    ],
    name: 'AdminChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'beacon',
        type: 'address'
      }
    ],
    name: 'BeaconUpgraded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'collateral',
        type: 'bytes32'
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'what',
        type: 'string'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'previous',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'current',
        type: 'uint256'
      }
    ],
    name: 'CollateralParameterUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8'
      }
    ],
    name: 'Initialized',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'what',
        type: 'string'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'previous',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'current',
        type: 'uint256'
      }
    ],
    name: 'SystemParameterUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address'
      }
    ],
    name: 'Upgraded',
    type: 'event'
  },
  {
    inputs: [],
    name: 'G',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'R',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_collateralId',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: '_vaultAddr',
        type: 'address'
      },
      {
        internalType: 'int256',
        name: '_collateral',
        type: 'int256'
      },
      {
        internalType: 'int256',
        name: '_bitUSD',
        type: 'int256'
      }
    ],
    name: 'calculate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'caller',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_collateralId',
        type: 'bytes32'
      }
    ],
    name: 'collateralToken',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    name: 'collateralTypes',
    outputs: [
      {
        internalType: 'address',
        name: 'tokenAddress',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'safetyFactor',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'rate',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'totalDebt',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'totalLocked',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'vaultMaxDebt',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'vaultMinDebt',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'maxDebt',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_collateralId',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: '_vaultAddr',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_bitUSD',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_collateral',
        type: 'uint256'
      }
    ],
    name: 'confiscate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'debt',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_collateralId',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: '_vault',
        type: 'address'
      }
    ],
    name: 'getDebt',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_collateralId',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: '_vaultAddr',
        type: 'address'
      },
      {
        internalType: 'int256',
        name: '_collateral',
        type: 'int256'
      },
      {
        internalType: 'int256',
        name: '_bitUSD',
        type: 'int256'
      },
      {
        internalType: 'uint256',
        name: '_protectionSafety',
        type: 'uint256'
      }
    ],
    name: 'getVaultChange',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'liquidationPrice',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'healthFactor',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'debtBitUSD',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'lockedCollateral',
            type: 'uint256'
          },
          {
            internalType: 'int256',
            name: 'availableToWithdraw',
            type: 'int256'
          },
          {
            internalType: 'int256',
            name: 'availableToMint',
            type: 'int256'
          }
        ],
        internalType: 'struct VaultManager.VaultChange',
        name: 'o',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_collateralId',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: '_token',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_safeFactor',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_maxDebt',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_vaultMinDebt',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_vaultMaxDebt',
        type: 'uint256'
      }
    ],
    name: 'initCollateral',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_oracle',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_totalDebtCeiling',
        type: 'uint256'
      }
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'oracle',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'proxiableUUID',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_caller',
        type: 'address'
      }
    ],
    name: 'setCaller',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_id',
        type: 'bytes32'
      },
      {
        internalType: 'uint256',
        name: '_maxDebt',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_vaultMinDebt',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_vaultMaxDebt',
        type: 'uint256'
      }
    ],
    name: 'setCollateralDebtCaps',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_collateralId',
        type: 'bytes32'
      },
      {
        internalType: 'uint256',
        name: '_v',
        type: 'uint256'
      }
    ],
    name: 'setCollateralSafetyFactor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_collateralId',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: '_v',
        type: 'address'
      }
    ],
    name: 'setCollateralToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_oracle',
        type: 'address'
      }
    ],
    name: 'setOracle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_v',
        type: 'uint256'
      }
    ],
    name: 'setTotalDebtCeiling',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'totalDebtCeiling',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address'
      }
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address'
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes'
      }
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_collateralId',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: '_vault',
        type: 'address'
      }
    ],
    name: 'vaultPosition',
    outputs: [
      {
        internalType: 'bool',
        name: 'isSafe',
        type: 'bool'
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'lockedCollateral',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'debtBitUSD',
            type: 'uint256'
          }
        ],
        internalType: 'struct IVaultManager.Vault',
        name: 'vault',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    name: 'vaults',
    outputs: [
      {
        internalType: 'uint256',
        name: 'lockedCollateral',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'debtBitUSD',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
]

export const bitUsdL2ABI = [
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name_',
        type: 'string'
      },
      {
        internalType: 'string',
        name: 'symbol_',
        type: 'string'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [],
    name: 'AlreadyInitialized',
    type: 'error'
  },
  {
    inputs: [],
    name: 'NotCaller',
    type: 'error'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256'
      }
    ],
    name: 'Approval',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256'
      }
    ],
    name: 'Transfer',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address'
      }
    ],
    name: 'allowance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_recipient',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256'
      }
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'caller',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'subtractedValue',
        type: 'uint256'
      }
    ],
    name: 'decreaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'addedValue',
        type: 'uint256'
      }
    ],
    name: 'increaseAllowance',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_caller',
        type: 'address'
      }
    ],
    name: 'init',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'initialized',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_recipient',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256'
      }
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'transfer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'transferFrom',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  }
]
