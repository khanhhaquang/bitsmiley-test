import { useEffect, useMemo, useState } from 'react'
import { formatEther, Hash, isAddress, isHash, parseEther } from 'viem'
import {
  useBalance,
  useSendTransaction,
  useWaitForTransactionReceipt
} from 'wagmi'

import {
  ArrowRightDoubleIcon,
  CloseIcon,
  ProcessingInfoModalTitleIcon
} from '@/assets/icons'
import { useWriteBitUsdTransfer } from '@/contracts/BitUsd'
import { useContractAddresses } from '@/hooks/useContractAddresses'
import { useTokenBalance } from '@/hooks/useTokenBalance'
import { useUserInfo } from '@/hooks/useUserInfo'
import { TransactionStatus } from '@/types/common'
import { cn } from '@/utils/cn'
import { getTxnErrorMsg } from '@/utils/error'

import { ActionButton, InputSuffixActionButton } from './ActionButton'
import BitUsdInput from './Input'
import { NumberInput } from './NumberInput'
import { ProcessingModal } from './Processing'
import { ProcessingType } from './Processing.types'

import { formatBitUsd, formatWBtc } from '../display'

//TODO: will remove in the future, keeping for now for reference

const TransferFromAA = () => {
  const { address, blockExplorerUrl } = useUserInfo()
  const { sendTransaction } = useSendTransaction()

  const { evmContractAddresses } = useContractAddresses()
  const transferWbtc = useWriteBitUsdTransfer()
  const { balance: wbtcBalance } = useTokenBalance(evmContractAddresses?.WBTC)
  const { balance: bitUsdBalance } = useTokenBalance(
    evmContractAddresses?.BitUSDL2
  )
  const { data: nativeBalance } = useBalance({ address: address })

  const [isOpen, setIsOpen] = useState(true)
  const [btc, setBtc] = useState('')
  const [wbtc, setWbtc] = useState('')
  const [bitUsd, setBitUsd] = useState('')
  const [to, setTo] = useState('')
  const [txnStatus, setTxnStatus] = useState(TransactionStatus.Idle)
  const [txnId, setTxnId] = useState('')
  const [txnError, setTxnError] = useState('')

  const wbtcInputError = useMemo(() => {
    if (wbtcBalance && Number(wbtc) > wbtcBalance) {
      return 'Amount exceeds balance'
    }

    return ''
  }, [wbtc, wbtcBalance])

  const bitUsdInputError = useMemo(() => {
    if (bitUsd && Number(bitUsd) > bitUsdBalance) {
      return 'Amount exceeds balance'
    }

    return ''
  }, [bitUsd, bitUsdBalance])

  const btcInputError = useMemo(() => {
    if (
      btc &&
      nativeBalance?.value &&
      Number(btc) > Number(formatEther(nativeBalance?.value))
    ) {
      return 'Amount exceeds balance'
    }

    return ''
  }, [btc, nativeBalance?.value])

  const addressInputError = useMemo(() => {
    if (to && !isAddress(to)) {
      return 'Please enter valid address'
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
    if (isAddress(to) && address) {
      if (btc) {
        setTxnStatus(TransactionStatus.Signing)
        sendTransaction(
          {
            to,
            value: parseEther(btc)
          },
          {
            onSettled: (data) => {
              setTxnId(data || '')
              setTxnStatus(TransactionStatus.Processing)
            },
            onError: (error) => {
              setTxnStatus(TransactionStatus.Failed)
              setTxnError(getTxnErrorMsg(error))
            }
          }
        )
      } else {
        if (wbtc && evmContractAddresses?.WBTC) {
          try {
            setTxnStatus(TransactionStatus.Signing)
            const txnHash = await transferWbtc.writeContractAsync({
              address: evmContractAddresses?.WBTC,
              args: [to, parseEther(wbtc)]
            })

            setTxnId(txnHash)
            setTxnStatus(TransactionStatus.Processing)
          } catch (error) {
            setTxnStatus(TransactionStatus.Failed)
            setTxnError(getTxnErrorMsg(error))
          }
        }

        if (bitUsd && evmContractAddresses?.BitUSDL2) {
          try {
            setTxnStatus(TransactionStatus.Signing)
            const txnHash = await transferWbtc.writeContractAsync({
              address: evmContractAddresses?.BitUSDL2,
              args: [to, parseEther(bitUsd)]
            })

            setTxnId(txnHash)
            setTxnStatus(TransactionStatus.Processing)
          } catch (error) {
            setTxnStatus(TransactionStatus.Failed)
            setTxnError(getTxnErrorMsg(error))
          }
        }
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
    }
    if (txnReceipt?.status === 'reverted') {
      setTxnStatus(TransactionStatus.Failed)
    }
  }, [txnReceipt?.status])

  if (!isOpen) return null

  return (
    <>
      {processingModal}
      <div className="absolute inset-0 z-40 flex size-full flex-col items-center justify-center overflow-y-auto overscroll-contain bg-black/50 pt-12 backdrop-blur-sm">
        <div
          className={cn(
            'flex w-full flex-col items-center justify-center bg-black',
            'w-[384px]'
          )}>
          <div
            className={cn(
              'flex w-full items-center justify-center border border-blue px-0.5 py-[1px] text-blue'
            )}>
            <ProcessingInfoModalTitleIcon />
            <div
              className={cn(
                'flex h-full items-center justify-center px-4 font-smb text-xs [text-shadow:1.5px_0_0_rgba(38,72,239,0.25)]',
                'text-blue'
              )}>
              Transfer
            </div>

            <ProcessingInfoModalTitleIcon />

            <button
              className="flex h-full w-6 shrink-0 items-center justify-center"
              onClick={() => setIsOpen(false)}>
              <CloseIcon height={13} width={13} />
            </button>
          </div>

          <div
            className={cn(
              'flex w-full flex-col p-6 gap-y-6 items-center justify-center border border-t-0 border-blue bg-black text-center font-ibmr text-sm text-white'
            )}>
            <p className="text-sm text-white/70">
              The AA wallet network is found unstable. We strongly suggest you
              to transfer your balance in AA wallet to another address for
              better experience.
            </p>

            <div className="flex w-full flex-col gap-y-1.5">
              <NumberInput
                scale={8}
                value={wbtc}
                disabled={!wbtcBalance}
                errorMessage={wbtcInputError}
                onInputChange={(v) => {
                  setBtc('')
                  setBitUsd('')
                  setWbtc(v || '')
                }}
                title="WBTC"
                titleSuffix={`Balance: ${formatWBtc(wbtcBalance, false, true)}`}
                inputSuffix={
                  <InputSuffixActionButton
                    onClick={() => setWbtc(wbtcBalance.toString())}>
                    Max
                  </InputSuffixActionButton>
                }
              />
              <NumberInput
                scale={4}
                value={bitUsd}
                disabled={!bitUsdBalance}
                errorMessage={bitUsdInputError}
                onInputChange={(v) => {
                  setBtc('')
                  setWbtc('')
                  setBitUsd(v || '')
                }}
                title="BITUSD"
                titleSuffix={`Balance: ${formatBitUsd(
                  bitUsdBalance,
                  false,
                  true
                )}`}
                inputSuffix={
                  <InputSuffixActionButton
                    onClick={() => setBitUsd(bitUsdBalance.toString())}>
                    Max
                  </InputSuffixActionButton>
                }
              />
              <span className="text-sm text-blue">or</span>
              <NumberInput
                scale={8}
                value={btc}
                disabled={!nativeBalance?.value}
                errorMessage={btcInputError}
                onInputChange={(v) => {
                  setWbtc('')
                  setBitUsd('')
                  setBtc(v || '')
                }}
                title="BTC"
                titleSuffix={`Balance: ${formatWBtc(
                  nativeBalance?.value ? formatEther(nativeBalance?.value) : '',
                  false,
                  true
                )}`}
                inputSuffix={
                  <InputSuffixActionButton
                    onClick={() =>
                      nativeBalance?.value &&
                      setBtc(formatEther(nativeBalance?.value))
                    }>
                    Max
                  </InputSuffixActionButton>
                }
              />

              <div className="flex w-full items-center justify-center gap-x-1">
                <p className="h-[1px] w-12 bg-blue" />
                <span className="text-sm text-blue">to</span>
                <p className="h-[1px] w-12 bg-blue" />
              </div>

              <BitUsdInput
                errorMessage={addressInputError}
                placeholder="Wallet Address"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>

            <ActionButton
              className={cn(
                'w-[121px] flex gap-x-2 items-center text-white/70'
              )}
              onClick={handleTransfer}>
              Transfer <ArrowRightDoubleIcon />
            </ActionButton>
          </div>
        </div>
      </div>
    </>
  )
}

export default TransferFromAA
