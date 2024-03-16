import { ReactNode, useMemo } from 'react'

import {
  ProcessingInfoModalTitleIcon,
  ProcessingInfoTitleIcon
} from '@/assets/icons'
import { cn } from '@/utils/cn'

import { ActionButton } from './ActionButton'

type ProcessingProps = {
  title?: string
  message: ReactNode
  isModal?: boolean
  actionButtonText?: string
  onClickActionButton?: () => void
  titleClassName?: string
  actionButtonClassName?: string
  type?: 'info' | 'success' | 'error'
  link?: string
}

export const ProcessingModal: React.FC<
  Omit<ProcessingProps, 'isModal'> & { open: boolean }
> = ({ open, ...rest }) => {
  if (!open) return null

  return (
    <div className="absolute inset-0 z-50 flex size-full flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
      <Processing isModal {...rest} />
    </div>
  )
}

export const Processing: React.FC<ProcessingProps> = ({
  type = 'info',
  title,
  message,
  isModal,
  actionButtonText,
  onClickActionButton,
  titleClassName,
  actionButtonClassName,
  link
}) => {
  console.log('🚀 ~ link:', link)
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

  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center bg-black',
        isModal && 'w-[400px]'
      )}>
      <div
        className={cn(
          'flex w-full items-center justify-center border border-blue px-0.5 py-[1px] text-blue',
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
      </div>

      <div
        className={cn(
          'flex w-full flex-col items-center justify-center gap-y-6 border border-t-0 border-blue bg-black px-10 py-9 text-center font-ibmr text-sm text-white',
          borderColorClassName
        )}>
        <p>
          {message}
          {!!link && (
            <span>
              {' '}
              You can check it on-chain{' '}
              <span
                className={cn(
                  'cursor-pointer',
                  type === 'error' ? 'text-warning/50' : 'text-green'
                )}>
                [
                <a href={link} target="_blank" className="hover:underline">
                  Click here
                </a>
                ]
              </span>
            </span>
          )}
        </p>

        {actionButtonText && (
          <ActionButton
            className={cn('w-full', actionButtonClassName)}
            onClick={onClickActionButton}>
            {actionButtonText}
          </ActionButton>
        )}
      </div>
    </div>
  )
}
