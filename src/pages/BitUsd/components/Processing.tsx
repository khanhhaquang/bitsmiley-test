import { ReactNode, useEffect, useMemo } from 'react'

import {
  CrossGreenIcon,
  CrossRedIcon,
  MinimizeIcon,
  ProcessingInfoModalTitleIcon,
  ProcessingInfoTitleIcon
} from '@/assets/icons'
import { Image } from '@/components/Image'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import { ActionButton } from './ActionButton'

export enum ProcessingType {
  Processing = 'processing',
  Success = 'success',
  Error = 'error',
  Info = 'info'
}

type ProcessingProps = {
  className?: string
  title?: string
  message: ReactNode
  isModal?: boolean
  actionButtonText?: string
  onClickActionButton?: () => void
  titleClassName?: string
  actionButtonClassName?: string
  type?: ProcessingType
  link?: string
  onClickRightButton?: () => void
}

const ProcessingLoader = () => {
  return (
    <div className="flex items-center gap-x-1.5">
      <Image
        src={getIllustrationUrl('bitusd-loader-dots', 'webp')}
        width={34}
        height={14}
      />
      <Image
        src={getIllustrationUrl('bitusd-loader-smiley', 'webp')}
        width={26}
        height={32}
      />

      <Image
        src={getIllustrationUrl('bitusd-loader-dots', 'webp')}
        width={34}
        height={14}
      />
    </div>
  )
}

export const ProcessingModal: React.FC<Omit<ProcessingProps, 'isModal'>> = ({
  ...props
}) => {
  useEffect(() => {
    const machineContainer = document.getElementById(
      'machine-content-container'
    )
    machineContainer?.classList.add('no-scroll')
    return () => {
      machineContainer?.classList.remove('no-scroll')
    }
  }, [])

  return (
    <div className="absolute inset-0 z-50 flex size-full flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
      <Processing isModal {...props} />
    </div>
  )
}

export const Processing: React.FC<ProcessingProps> = ({
  type = ProcessingType.Info,
  title,
  message,
  isModal,
  actionButtonText,
  onClickActionButton,
  titleClassName,
  actionButtonClassName,
  className,
  link,
  onClickRightButton
}) => {
  const borderColorClassName = useMemo(() => {
    if (type === 'success') return 'border-green/70'
    if (type === 'error') return 'border-warning/50'
    return 'border-blue'
  }, [type])
  const titleColorClassName = useMemo(() => {
    if (type === 'success') return 'text-green/70'
    if (type === 'error') return 'text-warning/50'
    return 'text-blue'
  }, [type])
  const titleTextColorClassName = useMemo(() => {
    if (type === 'success') return 'text-green'
    if (type === 'error') return 'text-warning'
    return 'text-blue'
  }, [type])
  const defaultTitle = useMemo(() => {
    if (type === 'success') return 'Success'
    if (type === 'error') return 'Failed'
    return 'Processing'
  }, [type])
  const rightButton = useMemo(() => {
    if (type === 'success')
      return <CrossGreenIcon width={14} height={14}></CrossGreenIcon>
    if (type === 'error')
      return <CrossRedIcon width={14} height={14}></CrossRedIcon>
    return <MinimizeIcon width={14} height={14}></MinimizeIcon>
  }, [type])

  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center bg-black',
        isModal && 'w-[430px]',
        className
      )}>
      <div
        className={cn(
          'flex w-full items-center justify-center border border-blue px-0.5 py-[1px] text-blue relative',
          borderColorClassName,
          titleColorClassName
        )}>
        {isModal ? (
          <ProcessingInfoModalTitleIcon className="w-full" />
        ) : (
          <ProcessingInfoTitleIcon className="w-full" />
        )}
        <div
          className={cn(
            'flex h-full items-center justify-center px-4 font-smb text-xs [text-shadow:1.5px_0_0_rgba(38,72,239,0.25)]',
            titleTextColorClassName,
            titleClassName
          )}>
          {title || defaultTitle}
        </div>
        {isModal ? (
          <ProcessingInfoModalTitleIcon className="w-full" />
        ) : (
          <ProcessingInfoTitleIcon className="w-full" />
        )}
        {onClickRightButton && (
          <button
            className="absolute right-1 top-1 flex size-[23px] items-center justify-center bg-black"
            onClick={onClickRightButton}>
            {rightButton}
          </button>
        )}
      </div>

      <div
        className={cn(
          'flex w-full flex-col items-center justify-center gap-y-6 border border-t-0 border-blue bg-black px-3 py-6 text-center font-ibmr text-sm text-white',
          {
            'py-6 px-3': isModal
          },
          borderColorClassName
        )}>
        {type === 'info' && <ProcessingLoader />}
        <div className="w-fit">
          {message}
          {!!link && (
            <p>
              {' '}
              You can check it{' '}
              <span
                className={cn(
                  'cursor-pointer',
                  type === 'error' ? 'text-warning/50' : 'text-green'
                )}>
                [
                <a href={link} target="_blank" className="hover:underline">
                  here
                </a>
                ]
              </span>
            </p>
          )}
        </div>

        {actionButtonText && (
          <ActionButton
            className={cn('w-[302px]', actionButtonClassName)}
            onClick={onClickActionButton}>
            {actionButtonText}
          </ActionButton>
        )}
      </div>
    </div>
  )
}
