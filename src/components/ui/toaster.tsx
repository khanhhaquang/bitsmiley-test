import { FailIcon, SmileyIcon } from '@/assets/icons'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport
} from '@/components//ui/toast'
import { useToast } from '@/components//ui/use-toast'

import { TransactionToasts } from './TransactionToasts'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        variant,
        description,
        action,
        ...props
      }) {
        return (
          <Toast key={id} {...props} className="flex gap-x-4 px-4">
            {variant === 'destructive' ? (
              <FailIcon width={28} height={24} />
            ) : (
              <SmileyIcon className="text-green" width={26} height={28} />
            )}
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="right-4 top-3" />
          </Toast>
        )
      })}
      <TransactionToasts />
      <ToastViewport />
    </ToastProvider>
  )
}
