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
}> = ({
  totalPagesNum,
  currentPageNum,
  setCurrentPageNum,
  onClickNext,
  onClickPrevious,
  hasNextPage,
  hasPreviousPage
}) => {
  if (!totalPagesNum || !currentPageNum) return null

  const renderNumbers = () => {
    if (totalPagesNum <= 4) {
      return (
        <>
          {Array(totalPagesNum)
            .fill(1)
            .map((_, idx) => (
              <PaginationNumber
                key={idx + 1}
                num={idx + 1}
                currentPageNum={currentPageNum}
                setCurrentPageNum={setCurrentPageNum}
              />
            ))}
        </>
      )
    }
    return (
      <>
        <PaginationNumber
          num={1}
          currentPageNum={currentPageNum}
          setCurrentPageNum={setCurrentPageNum}
        />
        {currentPageNum > 3 ? (
          <div>...</div>
        ) : (
          <PaginationNumber
            num={2}
            currentPageNum={currentPageNum}
            setCurrentPageNum={setCurrentPageNum}
          />
        )}
        <PaginationNumber
          num={
            currentPageNum > 3
              ? currentPageNum >= totalPagesNum - 2
                ? totalPagesNum - 2
                : currentPageNum
              : 3
          }
          currentPageNum={currentPageNum}
          setCurrentPageNum={setCurrentPageNum}
        />
        {currentPageNum > 3 && currentPageNum >= totalPagesNum - 2 ? (
          <PaginationNumber
            num={totalPagesNum - 1}
            currentPageNum={currentPageNum}
            setCurrentPageNum={setCurrentPageNum}
          />
        ) : (
          <div>...</div>
        )}
        <PaginationNumber
          num={totalPagesNum}
          currentPageNum={currentPageNum}
          setCurrentPageNum={setCurrentPageNum}
        />
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

const PaginationNumber: React.FC<{
  num: number
  currentPageNum: number
  setCurrentPageNum: React.Dispatch<React.SetStateAction<number>>
}> = ({ currentPageNum, num, setCurrentPageNum }) => {
  return (
    <div
      onClick={() => setCurrentPageNum(num)}
      className={cn(
        'cursor-pointer hover:underline',
        currentPageNum === num && 'text-green/70 font-ibmb'
      )}>
      {currentPageNum === num && '['}
      {num}
      {currentPageNum === num && ']'}
    </div>
  )
}
