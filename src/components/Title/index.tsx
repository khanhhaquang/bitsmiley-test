import './index.scss'
import { cn } from '@/utils/cn'

export const TitleBox: React.FC<{
  message: string
  isWhite?: boolean | undefined
}> = ({ message, isWhite = false }) => {
  return (
    <>
      <div
        className={cn(
          'flex h-[71px] items-center justify-center bg-white font-ppnb text-[48px] bg_blue',
          isWhite && 'bg_White'
        )}>
        {message}
      </div>
    </>
  )
}
