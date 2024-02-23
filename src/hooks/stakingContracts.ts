import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// staking
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const stakingAbi = [
  { type: 'error', inputs: [], name: 'AlreadyStaked' },
  { type: 'error', inputs: [], name: 'AlreadyWithdrawn' },
  { type: 'error', inputs: [], name: 'MaxParticipantsReached' },
  { type: 'error', inputs: [], name: 'NFTOwnershipNotTransferred' },
  { type: 'error', inputs: [], name: 'NotAcceptedNFT' },
  { type: 'error', inputs: [], name: 'PerAddressLimitReached' },
  { type: 'error', inputs: [], name: 'StakingEnded' },
  { type: 'error', inputs: [], name: 'StakingNotEnded' },
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
      { name: 'who', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'Staked'
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
      { name: 'who', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'Withdrawn'
  },
  {
    type: 'function',
    inputs: [],
    name: 'endStaking',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '_addr', internalType: 'address', type: 'address' }],
    name: 'getUserStakes',
    outputs: [{ name: 'stakes', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '_nftContractAddr', internalType: 'address', type: 'address' },
      { name: '_maxParticipants', internalType: 'uint16', type: 'uint16' },
      { name: '_perAddressLimit', internalType: 'uint16', type: 'uint16' }
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [],
    name: 'maxParticipants',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'nftContractAddr',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '_from', internalType: 'address', type: 'address' },
      { name: '_tokenId', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' }
    ],
    name: 'onERC721Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
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
    name: 'perAddressLimit',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
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
    inputs: [],
    name: 'stakingEnded',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenStake',
    outputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'stakedTime', internalType: 'uint256', type: 'uint256' },
      { name: 'withdrawTime', internalType: 'uint256', type: 'uint256' }
    ],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalParticipants',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
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
    inputs: [],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable'
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'withdrawn',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__
 */
export const useReadStaking = /*#__PURE__*/ createUseReadContract({
  abi: stakingAbi
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"getUserStakes"`
 */
export const useReadStakingGetUserStakes = /*#__PURE__*/ createUseReadContract({
  abi: stakingAbi,
  functionName: 'getUserStakes'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"maxParticipants"`
 */
export const useReadStakingMaxParticipants =
  /*#__PURE__*/ createUseReadContract({
    abi: stakingAbi,
    functionName: 'maxParticipants'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"nftContractAddr"`
 */
export const useReadStakingNftContractAddr =
  /*#__PURE__*/ createUseReadContract({
    abi: stakingAbi,
    functionName: 'nftContractAddr'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"owner"`
 */
export const useReadStakingOwner = /*#__PURE__*/ createUseReadContract({
  abi: stakingAbi,
  functionName: 'owner'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"perAddressLimit"`
 */
export const useReadStakingPerAddressLimit =
  /*#__PURE__*/ createUseReadContract({
    abi: stakingAbi,
    functionName: 'perAddressLimit'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"proxiableUUID"`
 */
export const useReadStakingProxiableUuid = /*#__PURE__*/ createUseReadContract({
  abi: stakingAbi,
  functionName: 'proxiableUUID'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"stakingEnded"`
 */
export const useReadStakingStakingEnded = /*#__PURE__*/ createUseReadContract({
  abi: stakingAbi,
  functionName: 'stakingEnded'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"tokenStake"`
 */
export const useReadStakingTokenStake = /*#__PURE__*/ createUseReadContract({
  abi: stakingAbi,
  functionName: 'tokenStake'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"totalParticipants"`
 */
export const useReadStakingTotalParticipants =
  /*#__PURE__*/ createUseReadContract({
    abi: stakingAbi,
    functionName: 'totalParticipants'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"withdrawn"`
 */
export const useReadStakingWithdrawn = /*#__PURE__*/ createUseReadContract({
  abi: stakingAbi,
  functionName: 'withdrawn'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakingAbi}__
 */
export const useWriteStaking = /*#__PURE__*/ createUseWriteContract({
  abi: stakingAbi
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"endStaking"`
 */
export const useWriteStakingEndStaking = /*#__PURE__*/ createUseWriteContract({
  abi: stakingAbi,
  functionName: 'endStaking'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteStakingInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: stakingAbi,
  functionName: 'initialize'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"onERC721Received"`
 */
export const useWriteStakingOnErc721Received =
  /*#__PURE__*/ createUseWriteContract({
    abi: stakingAbi,
    functionName: 'onERC721Received'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteStakingRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: stakingAbi,
    functionName: 'renounceOwnership'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteStakingTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: stakingAbi,
    functionName: 'transferOwnership'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"upgradeTo"`
 */
export const useWriteStakingUpgradeTo = /*#__PURE__*/ createUseWriteContract({
  abi: stakingAbi,
  functionName: 'upgradeTo'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useWriteStakingUpgradeToAndCall =
  /*#__PURE__*/ createUseWriteContract({
    abi: stakingAbi,
    functionName: 'upgradeToAndCall'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"withdraw"`
 */
export const useWriteStakingWithdraw = /*#__PURE__*/ createUseWriteContract({
  abi: stakingAbi,
  functionName: 'withdraw'
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakingAbi}__
 */
export const useSimulateStaking = /*#__PURE__*/ createUseSimulateContract({
  abi: stakingAbi
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"endStaking"`
 */
export const useSimulateStakingEndStaking =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakingAbi,
    functionName: 'endStaking'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateStakingInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakingAbi,
    functionName: 'initialize'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"onERC721Received"`
 */
export const useSimulateStakingOnErc721Received =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakingAbi,
    functionName: 'onERC721Received'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateStakingRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakingAbi,
    functionName: 'renounceOwnership'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateStakingTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakingAbi,
    functionName: 'transferOwnership'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"upgradeTo"`
 */
export const useSimulateStakingUpgradeTo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakingAbi,
    functionName: 'upgradeTo'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"upgradeToAndCall"`
 */
export const useSimulateStakingUpgradeToAndCall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakingAbi,
    functionName: 'upgradeToAndCall'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakingAbi}__ and `functionName` set to `"withdraw"`
 */
export const useSimulateStakingWithdraw =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakingAbi,
    functionName: 'withdraw'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakingAbi}__
 */
export const useWatchStakingEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: stakingAbi
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakingAbi}__ and `eventName` set to `"AdminChanged"`
 */
export const useWatchStakingAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stakingAbi,
    eventName: 'AdminChanged'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakingAbi}__ and `eventName` set to `"BeaconUpgraded"`
 */
export const useWatchStakingBeaconUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stakingAbi,
    eventName: 'BeaconUpgraded'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakingAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchStakingInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stakingAbi,
    eventName: 'Initialized'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakingAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchStakingOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stakingAbi,
    eventName: 'OwnershipTransferred'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakingAbi}__ and `eventName` set to `"Staked"`
 */
export const useWatchStakingStakedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stakingAbi,
    eventName: 'Staked'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakingAbi}__ and `eventName` set to `"Upgraded"`
 */
export const useWatchStakingUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stakingAbi,
    eventName: 'Upgraded'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakingAbi}__ and `eventName` set to `"Withdrawn"`
 */
export const useWatchStakingWithdrawnEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stakingAbi,
    eventName: 'Withdrawn'
  })
