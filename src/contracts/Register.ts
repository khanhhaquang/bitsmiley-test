import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Register
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const registerAbi = [
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
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link registerAbi}__
 */
export const useReadRegister = /*#__PURE__*/ createUseReadContract({
  abi: registerAbi
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link registerAbi}__ and `functionName` set to `"beneficiaries"`
 */
export const useReadRegisterBeneficiaries = /*#__PURE__*/ createUseReadContract(
  { abi: registerAbi, functionName: 'beneficiaries' }
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link registerAbi}__
 */
export const useWriteRegister = /*#__PURE__*/ createUseWriteContract({
  abi: registerAbi
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link registerAbi}__ and `functionName` set to `"transferBeneficiary"`
 */
export const useWriteRegisterTransferBeneficiary =
  /*#__PURE__*/ createUseWriteContract({
    abi: registerAbi,
    functionName: 'transferBeneficiary'
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link registerAbi}__
 */
export const useSimulateRegister = /*#__PURE__*/ createUseSimulateContract({
  abi: registerAbi
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link registerAbi}__ and `functionName` set to `"transferBeneficiary"`
 */
export const useSimulateRegisterTransferBeneficiary =
  /*#__PURE__*/ createUseSimulateContract({
    abi: registerAbi,
    functionName: 'transferBeneficiary'
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link registerAbi}__
 */
export const useWatchRegisterEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: registerAbi
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link registerAbi}__ and `eventName` set to `"BeneficiaryTransferred"`
 */
export const useWatchRegisterBeneficiaryTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: registerAbi,
    eventName: 'BeneficiaryTransferred'
  })
