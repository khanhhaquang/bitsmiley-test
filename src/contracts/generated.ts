import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// StakingContract
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 *
 */
export const stakingContractAbi = [
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

/**
 *
 */
export const stakingContractAddress = {
  686868: '0x1094187ec416ef2E6aE7fc70f10A9B6d4988F108'
} as const

/**
 *
 */
export const stakingContractConfig = {
  address: stakingContractAddress,
  abi: stakingContractAbi
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingContractAbi}__
 *
 *
 */
export const useReadStakingContract = /*#__PURE__*/ createUseReadContract({
  abi: stakingContractAbi,
  address: stakingContractAddress
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingContractAbi}__ and `functionName` set to `"getUserStakes"`
 *
 *
 */
export const useReadStakingContractGetUserStakes =
  /*#__PURE__*/ createUseReadContract({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    functionName: 'getUserStakes'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingContractAbi}__ and `functionName` set to `"maxParticipants"`
 *
 *
 */
export const useReadStakingContractMaxParticipants =
  /*#__PURE__*/ createUseReadContract({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    functionName: 'maxParticipants'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingContractAbi}__ and `functionName` set to `"nftContractAddr"`
 *
 *
 */
export const useReadStakingContractNftContractAddr =
  /*#__PURE__*/ createUseReadContract({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    functionName: 'nftContractAddr'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingContractAbi}__ and `functionName` set to `"owner"`
 *
 *
 */
export const useReadStakingContractOwner = /*#__PURE__*/ createUseReadContract({
  abi: stakingContractAbi,
  address: stakingContractAddress,
  functionName: 'owner'
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingContractAbi}__ and `functionName` set to `"perAddressLimit"`
 *
 *
 */
export const useReadStakingContractPerAddressLimit =
  /*#__PURE__*/ createUseReadContract({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    functionName: 'perAddressLimit'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingContractAbi}__ and `functionName` set to `"proxiableUUID"`
 *
 *
 */
export const useReadStakingContractProxiableUuid =
  /*#__PURE__*/ createUseReadContract({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    functionName: 'proxiableUUID'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingContractAbi}__ and `functionName` set to `"stakingEnded"`
 *
 *
 */
export const useReadStakingContractStakingEnded =
  /*#__PURE__*/ createUseReadContract({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    functionName: 'stakingEnded'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingContractAbi}__ and `functionName` set to `"tokenStake"`
 *
 *
 */
export const useReadStakingContractTokenStake =
  /*#__PURE__*/ createUseReadContract({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    functionName: 'tokenStake'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingContractAbi}__ and `functionName` set to `"totalParticipants"`
 *
 *
 */
export const useReadStakingContractTotalParticipants =
  /*#__PURE__*/ createUseReadContract({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    functionName: 'totalParticipants'
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link stakingContractAbi}__ and `functionName` set to `"withdrawn"`
 *
 *
 */
export const useReadStakingContractWithdrawn =
  /*#__PURE__*/ createUseReadContract({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    functionName: 'withdrawn'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakingContractAbi}__
 *
 *
 */
export const useWriteStakingContract = /*#__PURE__*/ createUseWriteContract({
  abi: stakingContractAbi,
  address: stakingContractAddress
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakingContractAbi}__ and `functionName` set to `"endStaking"`
 *
 *
 */
export const useWriteStakingContractEndStaking =
  /*#__PURE__*/ createUseWriteContract({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    functionName: 'endStaking'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakingContractAbi}__ and `functionName` set to `"initialize"`
 *
 *
 */
export const useWriteStakingContractInitialize =
  /*#__PURE__*/ createUseWriteContract({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    functionName: 'initialize'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakingContractAbi}__ and `functionName` set to `"onERC721Received"`
 *
 *
 */
export const useWriteStakingContractOnErc721Received =
  /*#__PURE__*/ createUseWriteContract({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    functionName: 'onERC721Received'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakingContractAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 *
 */
export const useWriteStakingContractRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    functionName: 'renounceOwnership'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakingContractAbi}__ and `functionName` set to `"transferOwnership"`
 *
 *
 */
export const useWriteStakingContractTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    functionName: 'transferOwnership'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakingContractAbi}__ and `functionName` set to `"upgradeTo"`
 *
 *
 */
export const useWriteStakingContractUpgradeTo =
  /*#__PURE__*/ createUseWriteContract({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    functionName: 'upgradeTo'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakingContractAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 *
 */
export const useWriteStakingContractUpgradeToAndCall =
  /*#__PURE__*/ createUseWriteContract({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    functionName: 'upgradeToAndCall'
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link stakingContractAbi}__ and `functionName` set to `"withdraw"`
 *
 *
 */
export const useWriteStakingContractWithdraw =
  /*#__PURE__*/ createUseWriteContract({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    functionName: 'withdraw'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakingContractAbi}__
 *
 *
 */
export const useSimulateStakingContract =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakingContractAbi,
    address: stakingContractAddress
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakingContractAbi}__ and `functionName` set to `"endStaking"`
 *
 *
 */
export const useSimulateStakingContractEndStaking =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    functionName: 'endStaking'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakingContractAbi}__ and `functionName` set to `"initialize"`
 *
 *
 */
export const useSimulateStakingContractInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    functionName: 'initialize'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakingContractAbi}__ and `functionName` set to `"onERC721Received"`
 *
 *
 */
export const useSimulateStakingContractOnErc721Received =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    functionName: 'onERC721Received'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakingContractAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 *
 */
export const useSimulateStakingContractRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    functionName: 'renounceOwnership'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakingContractAbi}__ and `functionName` set to `"transferOwnership"`
 *
 *
 */
export const useSimulateStakingContractTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    functionName: 'transferOwnership'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakingContractAbi}__ and `functionName` set to `"upgradeTo"`
 *
 *
 */
export const useSimulateStakingContractUpgradeTo =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    functionName: 'upgradeTo'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakingContractAbi}__ and `functionName` set to `"upgradeToAndCall"`
 *
 *
 */
export const useSimulateStakingContractUpgradeToAndCall =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    functionName: 'upgradeToAndCall'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link stakingContractAbi}__ and `functionName` set to `"withdraw"`
 *
 *
 */
export const useSimulateStakingContractWithdraw =
  /*#__PURE__*/ createUseSimulateContract({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    functionName: 'withdraw'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakingContractAbi}__
 *
 *
 */
export const useWatchStakingContractEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stakingContractAbi,
    address: stakingContractAddress
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakingContractAbi}__ and `eventName` set to `"AdminChanged"`
 *
 *
 */
export const useWatchStakingContractAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    eventName: 'AdminChanged'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakingContractAbi}__ and `eventName` set to `"BeaconUpgraded"`
 *
 *
 */
export const useWatchStakingContractBeaconUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    eventName: 'BeaconUpgraded'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakingContractAbi}__ and `eventName` set to `"Initialized"`
 *
 *
 */
export const useWatchStakingContractInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    eventName: 'Initialized'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakingContractAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 *
 */
export const useWatchStakingContractOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    eventName: 'OwnershipTransferred'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakingContractAbi}__ and `eventName` set to `"Staked"`
 *
 *
 */
export const useWatchStakingContractStakedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    eventName: 'Staked'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakingContractAbi}__ and `eventName` set to `"Upgraded"`
 *
 *
 */
export const useWatchStakingContractUpgradedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    eventName: 'Upgraded'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link stakingContractAbi}__ and `eventName` set to `"Withdrawn"`
 *
 *
 */
export const useWatchStakingContractWithdrawnEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: stakingContractAbi,
    address: stakingContractAddress,
    eventName: 'Withdrawn'
  })
