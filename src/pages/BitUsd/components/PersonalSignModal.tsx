import { useEffect, useMemo, useState } from 'react'
import { Hash, isAddress, isHash } from 'viem'
import { useWaitForTransactionReceipt } from 'wagmi'

import { AlertBg, CloseIcon } from '@/assets/icons'
import { useWriteRegisterTransferBeneficiary } from '@/contracts/Register'
import { useContractAddresses } from '@/hooks/useContractAddresses'
import { useRegister } from '@/hooks/useRegister'
import { useUserInfo } from '@/hooks/useUserInfo'
import { TransactionStatus } from '@/types/common'
import { cn } from '@/utils/cn'
import { getTxnErrorMsg } from '@/utils/error'

import { ActionButton } from './ActionButton'
import InputBlack from './InputBlack'
import { ProcessingModal, ProcessingType } from './Processing'

const PersonalSignModal = () => {
  const { address, blockExplorerUrl } = useUserInfo()

  const contractAddresses = useContractAddresses()
  const transferFromRegister = useWriteRegisterTransferBeneficiary()

  const [to, setTo] = useState('')
  const [txnStatus, setTxnStatus] = useState(TransactionStatus.Idle)
  const [txnId, setTxnId] = useState('')
  const [txnError, setTxnError] = useState('')
  const { refetchAirdropState } = useRegister()
  const [isOpen, setIsOpen] = useState(true)

  const registerAddress = contractAddresses?.register

  const addressInputError = useMemo(() => {
    if (to && !isAddress(to)) {
      return 'This address is not EVM compatible'
    }
    return ''
  }, [to])

  const { data: txnReceipt } = useWaitForTransactionReceipt({
    hash: txnId as Hash,
    query: {
      enabled: isHash(txnId)
    }
  })

  const handleTransfer = async () => {
    console.log('to--', to)
    console.log('address--', address)
    if (isAddress(to) && address && registerAddress) {
      try {
        setTxnStatus(TransactionStatus.Signing)
        const txnHash = await transferFromRegister.writeContractAsync({
          address: registerAddress,
          args: [to]
        })
        setTxnId(txnHash)
        setTxnStatus(TransactionStatus.Processing)
      } catch (error) {
        console.log('sign', error)
        setTxnStatus(TransactionStatus.Failed)
        setTxnError(getTxnErrorMsg(error))
      }
    }
  }

  const processingModal = useMemo(() => {
    switch (txnStatus) {
      case TransactionStatus.Signing:
        return <ProcessingModal message="Waiting for wallet signature..." />

      case TransactionStatus.Processing:
        return (
          <ProcessingModal
            message="Your transaction is getting processed on-chain."
            link={
              !!blockExplorerUrl && !!txnId
                ? `${blockExplorerUrl}/tx/${txnId}`
                : ''
            }
          />
        )
      case TransactionStatus.Success:
        return (
          <ProcessingModal
            type={ProcessingType.Success}
            actionButtonText="Ok"
            message="Your transfer has been successful."
            onClickActionButton={() => {
              setTxnStatus(TransactionStatus.Idle)
            }}
            link={
              !!blockExplorerUrl && !!txnId
                ? `${blockExplorerUrl}/tx/${txnId}`
                : ''
            }
          />
        )

      case TransactionStatus.Failed:
        return (
          <ProcessingModal
            type={ProcessingType.Error}
            actionButtonText="Ok"
            onClickActionButton={() => {
              setTxnStatus(TransactionStatus.Idle)
            }}
            message={
              !blockExplorerUrl || !txnId ? (
                <span>{txnError}</span>
              ) : (
                <span>
                  The transaction has failed. You can check it on-chain{' '}
                  <a
                    className="cursor-pointer text-green hover:underline"
                    href={`${blockExplorerUrl}/tx/${txnId}`}>
                    here
                  </a>
                </span>
              )
            }
          />
        )
      default:
        return null
    }
  }, [blockExplorerUrl, txnError, txnId, txnStatus])

  useEffect(() => {
    if (txnReceipt?.status === 'success') {
      setTxnStatus(TransactionStatus.Success)
      refetchAirdropState()
    }
    if (txnReceipt?.status === 'reverted') {
      setTxnStatus(TransactionStatus.Failed)
    }
  }, [txnReceipt?.status, refetchAirdropState])

  if (!isOpen) return null

  return (
    <>
      {processingModal}
      <div className="absolute inset-0 z-40 flex size-full flex-col items-center justify-center bg-black/50">
        <div
          className={cn(
            'flex w-full flex-col items-center justify-center bg-black',
            'w-[600px] relative border border-white/20 p-[2px]'
          )}>
          <div className=" absolute left-0.5 top-0.5 z-0 rotate-180">
            <AlertBg />
          </div>
          <div className=" absolute bottom-0.5 right-0.5 z-0">
            <AlertBg />
          </div>
          <button
            className="absolute right-[13px] top-[11px] flex h-full w-6 shrink-0 cursor-pointer justify-center"
            onClick={() => setIsOpen(false)}>
            <CloseIcon height={13} width={13} />
          </button>
          <div
            className={cn(
              'flex w-full flex-col gap-y-6 items-center justify-center bg-black text-center font-ibmr text-sm text-white',
              'px-[48px] py-[24px] border border-white/20'
            )}>
            <h2 className="text-2xl font-semibold">Dear M-bitDisc Owner</h2>
            <p className="text-sm text-white">
              You will continue to enjoy the benefits of bitDisc on other L2s.
              Please provide an alternative EVM wallet if you have not done so.
            </p>
            <div className="flex w-full flex-col gap-y-1.5">
              <p className=" text-left text-[12px]">
                Current AA wallet address：
                <span className="text-white/70">{address}</span>
              </p>
              <InputBlack
                errorMessage={addressInputError}
                placeholder="Input wallet address"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>

            <ActionButton
              className={cn(
                ' relative w-[91px] flex py-[4px] border-white/50 bg-white/70 gap-x-2 items-center text-black/75 z-1 backdrop-blur-[2px]'
              )}
              onClick={handleTransfer}>
              Confirm
            </ActionButton>
          </div>
        </div>
      </div>
    </>
  )
}

export default PersonalSignModal
