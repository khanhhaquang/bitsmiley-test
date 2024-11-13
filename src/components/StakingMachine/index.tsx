import { useMemo } from 'react'

import { ArrowDownIcon } from '@/assets/icons'
import { CanvasFrames } from '@/components/CanvasFrames'
import { Image } from '@/components/Image'
import { Marquee } from '@/components/Marquee'
import { useWindowSize } from '@/hooks/useWindowSize'
import { cn } from '@/utils/cn'
import { getFrameUrl, getIllustrationUrl } from '@/utils/getAssetsUrl'

import { SmileyExpress } from './SmileyExpress'

export const StakingMachine: React.FC<{ hideScrollDown: boolean }> = ({
  hideScrollDown
}) => {
  const { width } = useWindowSize()

  const responsiveScaling = useMemo(() => {
    if (width <= 639) return 0.4
    if (width <= 1200) return 0.7
    if (width <= 1600) return 0.85
    return 0.89
  }, [width])

  const isMobile = useMemo(() => width <= 639, [width])

  return (
    <div
      className={cn(
        !isMobile && 'w-[1423px]',
        'relative z-10 flex h-[995px] shrink-0 items-center justify-center sm:mt-[-150px]'
      )}
      style={{
        transform: isMobile ? '' : `scale(${responsiveScaling})`
      }}>
      <SmileyExpress></SmileyExpress>
      {!isMobile && <StaticMachine />}
      <Lights />
      {!isMobile && <MarqueeText />}
      <ArrowDown hideScrollDown={hideScrollDown} />
    </div>
  )
}

const MarqueeText: React.FC = () => {
  const label = 'FUELS THE FUTURE OF BTC-FI'

  return (
    <div className="absolute bottom-[132px] left-[205px] z-[-1] h-fit w-[660px] bg-black">
      <Marquee speed={75} className="font-sdm text-[80px] text-yellow2">
        <span className="mr-6">{label}</span>
      </Marquee>
    </div>
  )
}

const StaticMachine: React.FC = () => {
  return (
    <Image
      className="absolute z-0 h-[995px] w-[1423px] shrink-0"
      src={getIllustrationUrl('machine-static', 'webp')}
    />
  )
}

const ArrowDown: React.FC<{ hideScrollDown: boolean }> = ({
  hideScrollDown
}) => {
  console.log(hideScrollDown)
  return (
    <a
      href="#whoIsBitSmiley"
      className={cn(
        'absolute left-1/2 top-[895px] -translate-x-1/2 animate-bounce',
        hideScrollDown && 'invisible'
      )}>
      <ArrowDownIcon />
    </a>
  )
}

const Lights: React.FC = () => {
  return (
    <div className="absolute inset-x-0 size-full">
      <CanvasFrames
        fps={1}
        width={1423}
        height={995}
        imgLocalPaths={[
          getFrameUrl('lights', 'light-1'),
          getFrameUrl('lights', 'light-2')
        ]}
      />
    </div>
  )
}
