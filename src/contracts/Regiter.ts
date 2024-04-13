import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Regiter
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const regiterAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'original',
        internalType: 'address',
        type: 'address',
        indexed: false
      },
      {
        name: 'newAddr',
        internalType: 'address',
        type: 'address',
        indexed: false
      }
    ],
    name: 'BeneficiaryTransferred'
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'beneficiaries',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view'
  },
  {
    type: 'function',
    inputs: [{ name: '_to', internalType: 'address', type: 'address' }],
    name: 'transferBeneficiary',
    outputs: [],
    stateMutability: 'nonpayable'
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link regiterAbi}__
 */
export const useReadRegiter = /*#__PURE__*/ createUseReadContract({
  abi: regiterAbi
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link regiterAbi}__ and `functionName` set to `"beneficiaries"`
 */
export const useReadRegiterBeneficiaries = /*#__PURE__*/ createUseReadContract({
  abi: regiterAbi,
  functionName: 'beneficiaries'
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link regiterAbi}__
 */
export const useWriteRegiter = /*#__PURE__*/ createUseWriteContract({
  abi: regiterAbi
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link regiterAbi}__ and `functionName` set to `"transferBeneficiary"`
 */
export const useWriteRegiterTransferBeneficiary =
  /*#__PURE__*/ createUseWriteContract({
    abi: regiterAbi,
    functionName: 'transferBeneficiary'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link regiterAbi}__
 */
export const useSimulateRegiter = /*#__PURE__*/ createUseSimulateContract({
  abi: regiterAbi
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link regiterAbi}__ and `functionName` set to `"transferBeneficiary"`
 */
export const useSimulateRegiterTransferBeneficiary =
  /*#__PURE__*/ createUseSimulateContract({
    abi: regiterAbi,
    functionName: 'transferBeneficiary'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link regiterAbi}__
 */
export const useWatchRegiterEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: regiterAbi
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link regiterAbi}__ and `eventName` set to `"BeneficiaryTransferred"`
 */
export const useWatchRegiterBeneficiaryTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: regiterAbi,
    eventName: 'BeneficiaryTransferred'
  })
