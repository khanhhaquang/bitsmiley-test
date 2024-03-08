import { ChevronLeftIcon, ChevronRightIcon } from '@/assets/icons'
import { cn } from '@/utils/cn'

export const Pagination: React.FC<{
  totalPagesNum?: number
  currentPageNum?: number
  setCurrentPageNum: React.Dispatch<React.SetStateAction<number>>
  onClickNext?: () => void
  onClickPrevious: () => void
  hasNextPage: boolean
  hasPreviousPage: boolean
  activeNumClassName?: string
}> = ({
  totalPagesNum,
  currentPageNum,
  setCurrentPageNum,
  onClickNext,
  onClickPrevious,
  hasNextPage,
  hasPreviousPage,
  activeNumClassName
}) => {
  if (!totalPagesNum || !currentPageNum) return null

  const renderNumberItem = (num: number) => {
    const activeNumCls = cn('text-blue font-ibmb', activeNumClassName)
    return (
      <div
        key={num}
        onClick={() => setCurrentPageNum(num)}
        className={
          currentPageNum === num
            ? activeNumCls
            : 'cursor-pointer hover:underline'
        }>
        {currentPageNum === num && '['}
        {num}
        {currentPageNum === num && ']'}
      </div>
    )
  }

  const renderNumbers = () => {
    if (totalPagesNum <= 4) {
      return (
        <>
          {Array(totalPagesNum)
            .fill(1)
            .map((_, idx) => renderNumberItem(idx + 1))}
        </>
      )
    }
    return (
      <>
        {renderNumberItem(1)}
        {currentPageNum > 3 ? <div>...</div> : renderNumberItem(2)}
        {renderNumberItem(
          currentPageNum > 3
            ? currentPageNum >= totalPagesNum - 2
              ? totalPagesNum - 2
              : currentPageNum
            : 3
        )}
        {currentPageNum > 3 && currentPageNum >= totalPagesNum - 2 ? (
          renderNumberItem(totalPagesNum - 1)
        ) : (
          <div>...</div>
        )}
        {renderNumberItem(totalPagesNum)}
      </>
    )
  }

  return (
    <div className="flex items-center justify-center">
      <div
        onClick={onClickPrevious}
        className={cn(
          'mr-3 flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm bg-white/20 hover:bg-white/50',
          !hasPreviousPage && 'cursor-not-allowed bg-white/10 hover:bg-white/10'
        )}>
        <ChevronLeftIcon />
      </div>

      <div className="flex items-center gap-x-2">{renderNumbers()}</div>

      <div
        onClick={onClickNext}
        className={cn(
          'ml-3 flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm bg-white/20 hover:bg-white/50',
          !hasNextPage && 'cursor-not-allowed bg-white/10 hover:bg-white/10'
        )}>
        <ChevronRightIcon />
      </div>
    </div>
  )
}
