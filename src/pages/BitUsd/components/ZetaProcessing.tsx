import { useMemo } from 'react'

import { CheckGreenIcon, CrossRedIcon } from '@/assets/icons'
import { Image } from '@/components/Image'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import { ProcessingModal } from './Processing'

export enum TxnStep {
  One = 'Step 1',
  Two = 'Step 2'
}

type ZetaProcessingProps = {
  status: 'processing' | 'success' | 'error'
  step: TxnStep
  txnId?: string
}

type ZetaStepProps = {
  status: 'processing' | 'success' | 'error' | 'none'
  step: TxnStep
}

const ZetaStep: React.FC<ZetaStepProps> = ({ status, step }) => {
  const borderColorClassName = useMemo(() => {
    if (status === 'success') return 'border-2 border-green/60 text-green'
    if (status === 'error') return 'border-2 border-warning/60 text-warning'
    if (status === 'processing') return 'border-2 border-blue/60 text-blue'
    return 'text-white/50'
  }, [status])

  const icon = useMemo(() => {
    if (status === 'success')
      return <CheckGreenIcon width={14} height={14}></CheckGreenIcon>
    if (status === 'error')
      return <CrossRedIcon width={14} height={14}></CrossRedIcon>
    if (status === 'processing')
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
      className={cn('flex px-3 py-2 items-center gap-2', borderColorClassName)}>
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
    if (step === TxnStep.Two && status === 'success') {
      return 'success'
    }
    if (status === 'error') {
      return 'error'
    }
    return 'processing'
  }, [step, status])
  const actionButtonText = useMemo(() => {
    if (type === 'success' || type === 'error') {
      return 'Ok'
    }
    return undefined
  }, [type])
  const stepOneStatus = useMemo(() => {
    if (step === TxnStep.One) {
      return status
    }
    return 'success'
  }, [step, status])
  const stepTwoStatus = useMemo(() => {
    if (step === TxnStep.Two) {
      return status
    }
    return 'none'
  }, [step, status])
  const borderColorClassName = useMemo(() => {
    if (stepTwoStatus === 'success') {
      return 'border-green'
    }
    if (stepTwoStatus === 'processing') {
      return 'border-blue'
    }
    if (stepTwoStatus === 'error') {
      return 'border-warning'
    }
    return 'border-white/50'
  }, [stepTwoStatus])
  const onClickRightButton = () => {
    let statusText = 'getting processed'
    let textClassName = 'text-white/50'
    if (type === 'success') {
      statusText = 'successfull'
      textClassName = 'text-green'
    } else if (type === 'error') {
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
