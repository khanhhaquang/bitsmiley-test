import { useEffect, useMemo } from 'react'

import { CheckGreenIcon, CrossRedIcon } from '@/assets/icons'
import { Image } from '@/components/Image'
import { useToast } from '@/components/ui/use-toast'
import { useBtcNetwork } from '@/hooks/useBtcNetwork'
import { useUserInfo } from '@/hooks/useUserInfo'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import { ProcessingModal } from './Processing'
import { ProcessingType } from './Processing.types'
import { ProcessingStatus, TxnStep } from './ZetaProcessing.types'

type ZetaProcessingProps = {
  status: ProcessingStatus
  step: TxnStep
  txnId?: string
  open: boolean
  onOpen: () => void
  onClose: () => void
}

type ZetaStepProps = {
  status: ProcessingStatus | 'none'
  step: TxnStep
}

const ZetaStep: React.FC<ZetaStepProps> = ({ status, step }) => {
  const borderColorClassName = useMemo(() => {
    if (status === ProcessingStatus.Success)
      return 'border-2 border-green/60 text-green'
    if (status === ProcessingStatus.Error)
      return 'border-2 border-warning/60 text-warning'
    if (status === ProcessingStatus.Processing)
      return 'border-2 border-blue/60 text-blue'
    return 'text-white/50'
  }, [status])

  const icon = useMemo(() => {
    if (status === ProcessingStatus.Success)
      return <CheckGreenIcon width={14} height={14}></CheckGreenIcon>
    if (status === ProcessingStatus.Error)
      return <CrossRedIcon width={14} height={14}></CrossRedIcon>
    if (status === ProcessingStatus.Processing)
      return (
        <Image
          src={getIllustrationUrl('loading-blue-icon', 'webp')}
          width={14}
          height={14}
        />
      )
    return null
  }, [status])

  return (
    <div
      className={cn(
        'flex px-3 py-2 items-center gap-2 uppercase',
        borderColorClassName
      )}>
      <div>STEP {step}</div>
      {icon}
    </div>
  )
}

export const ZetaProcessing: React.FC<ZetaProcessingProps> = ({
  step,
  status,
  txnId,
  open,
  onOpen,
  onClose
}) => {
  const { toast, dismiss } = useToast()
  const { blockExplorerUrl } = useUserInfo()
  const { btcNetwork } = useBtcNetwork()

  const mempoolExplorerUrl = useMemo(
    () =>
      btcNetwork === 'livenet'
        ? 'https://mempool.space'
        : 'https://mempool.space/testnet',
    [btcNetwork]
  )

  const type = useMemo(() => {
    if (step === TxnStep.Two && status === ProcessingStatus.Success) {
      return ProcessingType.Success
    }
    if (status === ProcessingStatus.Error) {
      return ProcessingType.Error
    }
    return ProcessingType.Processing
  }, [step, status])

  const actionButtonText = useMemo(() => {
    if (type === ProcessingType.Success || type === ProcessingType.Error) {
      return 'Ok'
    }
    return undefined
  }, [type])

  const stepOneStatus = useMemo(() => {
    if (step === TxnStep.One) {
      return status
    }
    return ProcessingStatus.Success
  }, [step, status])

  const stepTwoStatus = useMemo(() => {
    if (step === TxnStep.Two) {
      return status
    }
    return 'none'
  }, [step, status])

  const borderColorClassName = useMemo(() => {
    if (stepTwoStatus === ProcessingStatus.Success) {
      return 'border-green'
    }
    if (stepTwoStatus === ProcessingStatus.Processing) {
      return 'border-blue'
    }
    if (stepTwoStatus === ProcessingStatus.Error) {
      return 'border-warning'
    }
    return 'border-white/50'
  }, [stepTwoStatus])

  const onClickRightButton = () => {
    onClose()
    let statusText = 'getting processed'
    let textClassName = 'text-white/50'
    if (type === ProcessingType.Success) {
      statusText = 'successful'
      textClassName = 'text-green'
    } else if (type === ProcessingType.Error) {
      statusText = 'failed'
      textClassName = 'text-warning'
    }
    toast({
      variant: type,
      className: 'w-[380px]',
      disableClose: type === ProcessingType.Processing,
      duration: 360000000,
      description: (
        <div className={textClassName}>
          Your transaction is {statusText}.{' '}
          <button className="hover:underline" onClick={onOpen}>
            [Click here]
          </button>{' '}
          to check
        </div>
      )
    })
    return
  }

  useEffect(() => {
    if (open) {
      console.log('onOpen dismiss')
      dismiss()
    }
  }, [dismiss, open])

  return (
    <>
      {open && (
        <ProcessingModal
          type={type}
          actionButtonText={actionButtonText}
          onClickRightButton={onClickRightButton}
          onClickActionButton={onClose}
          message={
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-2">
                <ZetaStep step={TxnStep.One} status={stepOneStatus}></ZetaStep>
                <div
                  className={cn(
                    'border-dotted border-t-2 w-12 h-[2px]',
                    borderColorClassName
                  )}></div>
                <ZetaStep step={TxnStep.Two} status={stepTwoStatus}></ZetaStep>
              </div>
              <div className="flex w-[380px] flex-col gap-2">
                {status === 'error' && (
                  <div className="text-warning">Transaction Failed</div>
                )}
                <div>
                  {type === ProcessingType.Success ? 'Zeta ' : 'BTC '}
                  Transaction
                </div>
                {txnId && (
                  <div className="break-words">
                    {type === ProcessingType.Success ? (
                      <a
                        className="underline"
                        target="_blank"
                        href={`${blockExplorerUrl}/cc/tx/${txnId}`}>
                        {txnId}
                      </a>
                    ) : (
                      <a
                        className="underline"
                        target="_blank"
                        href={`${mempoolExplorerUrl}/tx/${txnId}`}>
                        {txnId}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          }
        />
      )}
    </>
  )
}
