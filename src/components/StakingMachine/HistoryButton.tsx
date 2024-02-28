import { useMemo, useState } from 'react'
import { cn } from '@/utils/cn'
import { Image } from '@/components/Image'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { useUserInfo } from '@/hooks/useUserInfo'

type HistoryButtonProps = {
  onClick: () => void
}

export const HistoryButton: React.FC<HistoryButtonProps> = ({ onClick }) => {
  const { address } = useUserInfo()
  const [isPressed, setIsPressed] = useState(false)

  const isDisabled = !address

  const buttonImgName = useMemo(() => {
    if (isDisabled) return 'history-button-disabled'
    if (isPressed) return 'history-button-down'
    return 'history-button-up'
  }, [isDisabled, isPressed])

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseUp={async () => setIsPressed(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseLeave={() => setIsPressed(false)}
      className={cn(
        'absolute left-[740px] top-[626px] z-50 h-[76px] cursor-pointer',
        'flex flex-col justify-end',
        isDisabled && 'cursor-not-allowed'
      )}>
      <Image src={getIllustrationUrl(buttonImgName)} />
    </button>
  )
}
