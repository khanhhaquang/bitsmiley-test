import { useMemo } from 'react'

import { CheckGreenIcon, CrossRedIcon } from '@/assets/icons'
import { Image } from '@/components/Image'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import { ProcessingModal, ProcessingType } from './Processing'

export enum TxnStep {
  One = 'Step 1',
  Two = 'Step 2'
}

export enum ProcessingStatus {
  Processing = 'processing',
  Success = 'success',
  Error = 'error'
}

type ZetaProcessingProps = {
  status: ProcessingStatus
  step: TxnStep
  txnId?: string
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
      <div>{step}</div>
      {icon}
    </div>
  )
}

export const ZetaProcessing: React.FC<ZetaProcessingProps> = ({
  step,
  status,
  txnId
}) => {
  const explorerUrl = ''
  const { toast } = useToast()
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
    let statusText = 'getting processed'
    let textClassName = 'text-white/50'
    if (type === ProcessingType.Success) {
      statusText = 'successfull'
      textClassName = 'text-green'
    } else if (type === ProcessingType.Error) {
      statusText = 'failed'
      textClassName = 'text-warning'
    }
    toast({
      variant: type,
      className: 'w-[380px]',
      description: (
        <div className={textClassName}>
          Your transaction is {statusText}.{' '}
          <a
            className="hover:underline"
            target="_blank"
            href={`${explorerUrl}/tx/${txnId}`}>
            [Click here]
          </a>{' '}
          to check
        </div>
      )
    })
    return
  }
  return (
    <ProcessingModal
      type={type}
      actionButtonText={actionButtonText}
      onClickRightButton={onClickRightButton}
      message={
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <ZetaStep step={TxnStep.One} status={stepOneStatus}></ZetaStep>
            <div
              className={cn(
                'border-dotted border-t-2 w-12 h-[2px]',
                borderColorClassName
              )}></div>
            <ZetaStep step={TxnStep.Two} status={stepTwoStatus}></ZetaStep>
          </div>
          <div className="flex flex-col gap-2">
            {status === 'error' && (
              <div className="text-warning">Transaction Failed</div>
            )}
            <div>
              Transaction hash:
              <br />
              {txnId}
            </div>
          </div>
        </div>
      }
    />
  )
}
