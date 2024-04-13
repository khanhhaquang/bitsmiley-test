import { useEffect, useMemo, useState } from 'react'
import { Hash, isAddress, isHash } from 'viem'
import { useWaitForTransactionReceipt } from 'wagmi'

import { AlertBg, CloseIcon } from '@/assets/icons'
import { useWriteRegiterTransferBeneficiary } from '@/contracts/Regiter'
import { useContractAddresses } from '@/hooks/useContractAddresses'
import { useRegiter } from '@/hooks/useRegiter'
import { useUserInfo } from '@/hooks/useUserInfo'
import { TransactionStatus } from '@/types/common'
import { cn } from '@/utils/cn'
import { getTxnErrorMsg } from '@/utils/error'

import { ActionButton } from './ActionButton'
import InputBlack from './InputBlack'
import { ProcessingModal } from './Processing'

const PersonalSignModal = () => {
  const { address, blockExplorerUrl } = useUserInfo()

  const contractAddresses = useContractAddresses()
  const transferFromRegiter = useWriteRegiterTransferBeneficiary()

  const [to, setTo] = useState('')
  const [txnStatus, setTxnStatus] = useState(TransactionStatus.Idle)
  const [txnId, setTxnId] = useState('')
  const [txnError, setTxnError] = useState('')
  const { refetchAirdropState } = useRegiter()
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
        const txnHash = await transferFromRegiter.writeContractAsync({
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
            type="success"
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
            type="error"
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
      <div className="absolute inset-0 z-40 flex size-full flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
        <div
          className={cn(
            'flex w-full flex-col items-center justify-center bg-black px-[48px] py-[24px]',
            'w-[537px] relative'
          )}>
          <div className=" absolute left-0 top-0 rotate-180">
            <AlertBg />
          </div>
          <div className=" absolute bottom-0 right-0">
            <AlertBg />
          </div>
          <button
            className="absolute right-2 flex h-full w-6 shrink-0 justify-center"
            onClick={() => setIsOpen(false)}>
            <CloseIcon height={13} width={13} />
          </button>
          <div
            className={cn(
              'flex w-full flex-col gap-y-6 items-center justify-center bg-black text-center font-ibmr text-sm text-white'
            )}>
            <h2 className="text-2xl font-semibold uppercase">
              Dear bitdisc owner
            </h2>
            <p className="text-sm text-white">
              We will carry out our testnet campaign in other networks which
              might not have AA wallet enabled. Please leave another EVM wallet
              that you wish to receive future testnet airdrops.
            </p>

            <div className="flex w-full flex-col gap-y-1.5">
              <InputBlack
                errorMessage={addressInputError}
                placeholder="Wallet Address"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>

            <ActionButton
              className={cn(
                'w-[91px] flex py-[4px] border-white/50 bg-white/70 gap-x-2 items-center text-black/75'
              )}
              onClick={handleTransfer}>
              {/* onClick={() => signMessage()}> */}
              Confirm
            </ActionButton>
          </div>
        </div>
      </div>
    </>
  )
}

export default PersonalSignModal
