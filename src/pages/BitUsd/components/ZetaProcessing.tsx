import { useMemo } from 'react'
import { ProcessingModal } from './Processing'
import { cn } from '@/utils/cn'
import { Image } from '@/components/Image'
import { CheckGreenIcon, CrossRedIcon } from '@/assets/icons'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

export enum ZetaTransactionStep {
  One = 'Step 1',
  Two = 'Step 2'
}

type ZetaProcessingProps = {
  status: 'processing' | 'success' | 'error'
  step: ZetaTransactionStep
  txnHash?: string
}

type ZetaStepProps = {
  status: 'processing' | 'success' | 'error' | 'none'
  step: ZetaTransactionStep
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
  txnHash
}) => {
  const type = useMemo(() => {
    if (step === ZetaTransactionStep.Two && status === 'success') {
      return 'success'
    }
    if(status === 'error'){
      return 'error'
    }
    return 'info'
  }, [step, status])
  const actionButtonText = useMemo(() => {
    if (status === 'success' || status === 'error') {
      return 'Ok'
    }
    return undefined
  }, [type])
  const stepOneStatus = useMemo(() => {
    if (step === ZetaTransactionStep.One) {
      return status
    }
    return 'success'
  }, [step, status])
  const stepTwoStatus = useMemo(() => {
    if (step === ZetaTransactionStep.Two) {
      return status
    }
    return 'none'
  }, [step, status])
  return (
    <ProcessingModal
      type={type}
      actionButtonText={actionButtonText}
      message={
        <div className="flex flex-col gap-6">
          <div className="flex gap-2">
            <ZetaStep
              step={ZetaTransactionStep.One}
              status={stepOneStatus}></ZetaStep>
            <div className="text-white/50">------</div>
            <ZetaStep
              step={ZetaTransactionStep.Two}
              status={stepTwoStatus}></ZetaStep>
          </div>
          <div className="flex flex-col gap-2">
            {status === 'error' ? (
              <div className="text-warning">Transaction Failed</div>
            ) : (
              <div>Transaction</div>
            )}
            <div>
              Tx hash:
              <br />
              {txnHash}
            </div>
          </div>
        </div>
      }
    />
  )
}
