import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Airdrop
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const airdropAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  { type: 'error', inputs: [], name: 'AirdropAlreadyCreated' },
  { type: 'error', inputs: [], name: 'AirdropEnded' },
  { type: 'error', inputs: [], name: 'AirdropNotAvailable' },
  { type: 'error', inputs: [], name: 'AirdropTokenNotAvailable' },
  { type: 'error', inputs: [], name: 'AlreadyClaimed' },
  { type: 'error', inputs: [], name: 'EndTimeMustBeAfterStartTime' },
  { type: 'error', inputs: [], name: 'ExceededAllocation' },
  { type: 'error', inputs: [], name: 'NotAirdropCreator' },
  { type: 'error', inputs: [], name: 'NotInClaimWindow' },
  { type: 'error', inputs: [], name: 'NotInWhitelist' },
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
      { name: 'who', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'merkleRoot',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false
      },
      {
        name: 'totalAllocation',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      },
      {
        name: 'airdropStartTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      },
      {
        name: 'airdropEndTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'AirdropCreated'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'who', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'AirdropRedeemed'
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
      { name: 'who', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'receivedUsers',
        internalType: 'uint16',
        type: 'uint16',
        indexed: false
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      },
      {
        name: 'totalReceived',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'Claim'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'who', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'IncrementAirdropAllocation'
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
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false
      },
      {
        name: 'addedBy',
        internalType: 'address',
        type: 'address',
        indexed: false
      }
    ],
    name: 'TokenRegistered'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false
      },
      {
        name: 'addedBy',
        internalType: 'address',
        type: 'address',
        indexed: false
      }
    ],
    name: 'TokenRemoved'
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
      { name: 'who', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'merkleRoot',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false
      }
    ],
    name: 'UpdatedAirdropMerkleRoot'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'who', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'airdropStartTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      },
      {
        name: 'airdropEndTime',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'UpdatedAirdropTime'
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
    name: 'airdrop',
    outputs: [
      { name: 'receivedUsers', internalType: 'uint16', type: 'uint16' },
      { name: 'createdBy', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'startTime', internalType: 'uint256', type: 'uint256' },
      { name: 'endTime', internalType: 'uint256', type: 'uint256' },
      { name: 'merkleTreeRoot', internalType: 'bytes32', type: 'bytes32' },
      { name: 'totalAllocation', internalType: 'uint256', type: 'uint256' },
      { name: 'totalReceived', internalType: 'uint256', type: 'uint256' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'availableBalance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_who', internalType: 'address', type: 'address' },
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      { name: '_proof', internalType: 'bytes32[]', type: 'bytes32[]' }
    ],
    name: 'canClaim',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_amount', internalType: 'uint256', type: 'uint256' },
      { name: '_proof', internalType: 'bytes32[]', type: 'bytes32[]' }
    ],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'claimed',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_merkleRoot', internalType: 'bytes32', type: 'bytes32' },
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_totalAllocation', internalType: 'uint256', type: 'uint256' },
      { name: '_airdropStartTime', internalType: 'uint256', type: 'uint256' },
      { name: '_airdropEndTime', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'create',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '_amount', internalType: 'uint256', type: 'uint256' }],
    name: 'incrementTotalAllocation',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable'
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
    inputs: [{ name: '_token', internalType: 'address', type: 'address' }],
    name: 'register',
    outputs: [],
    stateMutability: 'nonpayable'
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
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'supportedTokens',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
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
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '_token', internalType: 'address', type: 'address' }],
    name: 'unregister',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [
      { name: '_startTime', internalType: 'uint256', type: 'uint256' },
      { name: '_endTime', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'updateAirdropTime',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '_merkleRoot', internalType: 'bytes32', type: 'bytes32' }],
    name: 'updateMerkleRoot',
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
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link airdropAbi}__
 */
export const useReadAirdrop = /*#__PURE__*/ createUseReadContract({
  abi: airdropAbi
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"airdrop"`
 */
export const useReadAirdropAirdrop = /*#__PURE__*/ createUseReadContract({
  abi: airdropAbi,
  functionName: 'airdrop'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"availableBalance"`
 */
export const useReadAirdropAvailableBalance =
  /*#__PURE__*/ createUseReadContract({
    abi: airdropAbi,
    functionName: 'availableBalance'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"canClaim"`
 */
export const useReadAirdropCanClaim = /*#__PURE__*/ createUseReadContract({
  abi: airdropAbi,
  functionName: 'canClaim'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"claimed"`
 */
export const useReadAirdropClaimed = /*#__PURE__*/ createUseReadContract({
  abi: airdropAbi,
  functionName: 'claimed'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"owner"`
 */
export const useReadAirdropOwner = /*#__PURE__*/ createUseReadContract({
  abi: airdropAbi,
  functionName: 'owner'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"paused"`
 */
export const useReadAirdropPaused = /*#__PURE__*/ createUseReadContract({
  abi: airdropAbi,
  functionName: 'paused'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"proxiableUUID"`
 */
export const useReadAirdropProxiableUuid = /*#__PURE__*/ createUseReadContract({
  abi: airdropAbi,
  functionName: 'proxiableUUID'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"supportedTokens"`
 */
export const useReadAirdropSupportedTokens =
  /*#__PURE__*/ createUseReadContract({
    abi: airdropAbi,
    functionName: 'supportedTokens'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link airdropAbi}__
 */
export const useWriteAirdrop = /*#__PURE__*/ createUseWriteContract({
  abi: airdropAbi
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"claim"`
 */
export const useWriteAirdropClaim = /*#__PURE__*/ createUseWriteContract({
  abi: airdropAbi,
  functionName: 'claim'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"create"`
 */
export const useWriteAirdropCreate = /*#__PURE__*/ createUseWriteContract({
  abi: airdropAbi,
  functionName: 'create'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"incrementTotalAllocation"`
 */
export const useWriteAirdropIncrementTotalAllocation =
  /*#__PURE__*/ createUseWriteContract({
    abi: airdropAbi,
    functionName: 'incrementTotalAllocation'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteAirdropInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: airdropAbi,
  functionName: 'initialize'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"pause"`
 */
export const useWriteAirdropPause = /*#__PURE__*/ createUseWriteContract({
  abi: airdropAbi,
  functionName: 'pause'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"register"`
 */
export const useWriteAirdropRegister = /*#__PURE__*/ createUseWriteContract({
  abi: airdropAbi,
  functionName: 'register'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteAirdropRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: airdropAbi,
    functionName: 'renounceOwnership'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteAirdropTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: airdropAbi,
    functionName: 'transferOwnership'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"unpause"`
 */
export const useWriteAirdropUnpause = /*#__PURE__*/ createUseWriteContract({
  abi: airdropAbi,
  functionName: 'unpause'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"unregister"`
 */
export const useWriteAirdropUnregister = /*#__PURE__*/ createUseWriteContract({
  abi: airdropAbi,
  functionName: 'unregister'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"updateAirdropTime"`
 */
export const useWriteAirdropUpdateAirdropTime =
  /*#__PURE__*/ createUseWriteContract({
    abi: airdropAbi,
    functionName: 'updateAirdropTime'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"updateMerkleRoot"`
 */
export const useWriteAirdropUpdateMerkleRoot =
  /*#__PURE__*/ createUseWriteContract({
    abi: airdropAbi,
    functionName: 'updateMerkleRoot'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"upgradeTo"`
 */
export const useWriteAirdropUpgradeTo = /*#__PURE__*/ createUseWriteContract({
  abi: airdropAbi,
  functionName: 'upgradeTo'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useWriteAirdropUpgradeToAndCall =
  /*#__PURE__*/ createUseWriteContract({
    abi: airdropAbi,
    functionName: 'upgradeToAndCall'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"withdraw"`
 */
export const useWriteAirdropWithdraw = /*#__PURE__*/ createUseWriteContract({
  abi: airdropAbi,
  functionName: 'withdraw'
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link airdropAbi}__
 */
export const useSimulateAirdrop = /*#__PURE__*/ createUseSimulateContract({
  abi: airdropAbi
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"claim"`
 */
export const useSimulateAirdropClaim = /*#__PURE__*/ createUseSimulateContract({
  abi: airdropAbi,
  functionName: 'claim'
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"create"`
 */
export const useSimulateAirdropCreate = /*#__PURE__*/ createUseSimulateContract(
  { abi: airdropAbi, functionName: 'create' }
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"incrementTotalAllocation"`
 */
export const useSimulateAirdropIncrementTotalAllocation =
  /*#__PURE__*/ createUseSimulateContract({
    abi: airdropAbi,
    functionName: 'incrementTotalAllocation'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateAirdropInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: airdropAbi,
    functionName: 'initialize'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"pause"`
 */
export const useSimulateAirdropPause = /*#__PURE__*/ createUseSimulateContract({
  abi: airdropAbi,
  functionName: 'pause'
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"register"`
 */
export const useSimulateAirdropRegister =
  /*#__PURE__*/ createUseSimulateContract({
    abi: airdropAbi,
    functionName: 'register'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateAirdropRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: airdropAbi,
    functionName: 'renounceOwnership'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateAirdropTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: airdropAbi,
    functionName: 'transferOwnership'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"unpause"`
 */
export const useSimulateAirdropUnpause =
  /*#__PURE__*/ createUseSimulateContract({
    abi: airdropAbi,
    functionName: 'unpause'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"unregister"`
 */
export const useSimulateAirdropUnregister =
  /*#__PURE__*/ createUseSimulateContract({
    abi: airdropAbi,
    functionName: 'unregister'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"updateAirdropTime"`
 */
export const useSimulateAirdropUpdateAirdropTime =
  /*#__PURE__*/ createUseSimulateContract({
    abi: airdropAbi,
    functionName: 'updateAirdropTime'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"updateMerkleRoot"`
 */
export const useSimulateAirdropUpdateMerkleRoot =
  /*#__PURE__*/ createUseSimulateContract({
    abi: airdropAbi,
    functionName: 'updateMerkleRoot'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"upgradeTo"`
 */
export const useSimulateAirdropUpgradeTo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: airdropAbi,
    functionName: 'upgradeTo'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useSimulateAirdropUpgradeToAndCall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: airdropAbi,
    functionName: 'upgradeToAndCall'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link airdropAbi}__ and `functionName` set to `"withdraw"`
 */
export const useSimulateAirdropWithdraw =
  /*#__PURE__*/ createUseSimulateContract({
    abi: airdropAbi,
    functionName: 'withdraw'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link airdropAbi}__
 */
export const useWatchAirdropEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: airdropAbi
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link airdropAbi}__ and `eventName` set to `"AdminChanged"`
 */
export const useWatchAirdropAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: airdropAbi,
    eventName: 'AdminChanged'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link airdropAbi}__ and `eventName` set to `"AirdropCreated"`
 */
export const useWatchAirdropAirdropCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: airdropAbi,
    eventName: 'AirdropCreated'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link airdropAbi}__ and `eventName` set to `"AirdropRedeemed"`
 */
export const useWatchAirdropAirdropRedeemedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: airdropAbi,
    eventName: 'AirdropRedeemed'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link airdropAbi}__ and `eventName` set to `"BeaconUpgraded"`
 */
export const useWatchAirdropBeaconUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: airdropAbi,
    eventName: 'BeaconUpgraded'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link airdropAbi}__ and `eventName` set to `"Claim"`
 */
export const useWatchAirdropClaimEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: airdropAbi,
    eventName: 'Claim'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link airdropAbi}__ and `eventName` set to `"IncrementAirdropAllocation"`
 */
export const useWatchAirdropIncrementAirdropAllocationEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: airdropAbi,
    eventName: 'IncrementAirdropAllocation'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link airdropAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchAirdropInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: airdropAbi,
    eventName: 'Initialized'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link airdropAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchAirdropOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: airdropAbi,
    eventName: 'OwnershipTransferred'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link airdropAbi}__ and `eventName` set to `"Paused"`
 */
export const useWatchAirdropPausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: airdropAbi,
    eventName: 'Paused'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link airdropAbi}__ and `eventName` set to `"TokenRegistered"`
 */
export const useWatchAirdropTokenRegisteredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: airdropAbi,
    eventName: 'TokenRegistered'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link airdropAbi}__ and `eventName` set to `"TokenRemoved"`
 */
export const useWatchAirdropTokenRemovedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: airdropAbi,
    eventName: 'TokenRemoved'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link airdropAbi}__ and `eventName` set to `"Unpaused"`
 */
export const useWatchAirdropUnpausedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: airdropAbi,
    eventName: 'Unpaused'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link airdropAbi}__ and `eventName` set to `"UpdatedAirdropMerkleRoot"`
 */
export const useWatchAirdropUpdatedAirdropMerkleRootEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: airdropAbi,
    eventName: 'UpdatedAirdropMerkleRoot'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link airdropAbi}__ and `eventName` set to `"UpdatedAirdropTime"`
 */
export const useWatchAirdropUpdatedAirdropTimeEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: airdropAbi,
    eventName: 'UpdatedAirdropTime'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link airdropAbi}__ and `eventName` set to `"Upgraded"`
 */
export const useWatchAirdropUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: airdropAbi,
    eventName: 'Upgraded'
  })
