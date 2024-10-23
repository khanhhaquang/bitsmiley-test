import { useMemo } from 'react'

import { cn } from '@/utils/cn'

const mockStakeAPY = 10000

const stakeFontSize = [
  '84px', // 0 char
  '84px', // 1 char
  '84px', // 2
  '72px', // 3
  '56px', // 4
  '48px' // 5
]

const StakeAPY = () => {
  const fontSize = useMemo(() => {
    const apyLength = mockStakeAPY?.toString()?.length || 0
    if (apyLength > stakeFontSize.length) return stakeFontSize[5]
    return stakeFontSize[`${apyLength}`]
  }, [])

  return (
    <div className="flex w-[340px] flex-col border border-[#FFAA00]/30">
      <div className="bg-[#FA0] px-4 py-[6px] font-smb text-xs uppercase text-black">
        Current APY
      </div>
      <div className="flex flex-1 items-center justify-center bg-[#1C1703] px-4">
        <div
          className={cn(
            'bg-clip-text bg-apyText text-transparent font-smb2 text-5xl'
          )}
          style={{
            fontSize: fontSize,
            WebkitTextStroke: 2,
            WebkitTextStrokeColor: '#301610'
          }}>
          {mockStakeAPY}%
        </div>
      </div>
    </div>
  )
}

export default StakeAPY
