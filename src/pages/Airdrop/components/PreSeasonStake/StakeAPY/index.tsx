import { useMemo } from 'react'

import { cn } from '@/utils/cn'
import './StakeAPY.scss'

const mockStakeAPY = 10000

const stakeFontSize = [
  'text-84px', // 0 char
  'text-84px', // 1 char
  'text-84px', // 2
  'text-72px', // 3
  'text-[56px]', // 4
  'text-[48px]' // 5
]

const StakeAPY = () => {
  const fontSize = useMemo(() => {
    const apyLength = mockStakeAPY?.toString()?.length
    if (apyLength > stakeFontSize.length) return stakeFontSize[5]
    // eslint-disable-next-line security/detect-object-injection
    return stakeFontSize[apyLength]
  }, [])

  return (
    <div className="flex w-[340px] flex-col border border-[#FFAA00]/30">
      <div className="bg-[#FA0] px-4 py-[6px] font-smb text-xs uppercase text-black">
        Current APY
      </div>
      <div className="flex flex-1 items-center justify-center bg-[#1C1703] px-4">
        <div
          className={cn(
            ' apy-stroke-text bg-clip-text bg-apyText text-transparent font-smb2 text-5xl ',
            fontSize
          )}>
          {mockStakeAPY}%
        </div>
      </div>
    </div>
  )
}

export default StakeAPY
