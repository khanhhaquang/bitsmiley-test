import HeaderSVG from '@/assets/icons/header.svg?react'
import SmileySVG from '@/assets/icons/smiley.svg?react'
import DotSVG from '@/assets/icons/dot.svg?react'
import CopyRightSVG from '@/assets/icons/copyright.svg?react'

import { Marquee } from '@/components/Marquee'
import { CanvasFrames } from '@/components/CanvasFrames'

import { cn } from '@/utils/cn'
import { getFrameUrl, getIllustrationUrl } from '@/utils/getImageUrl'
import { useWindowSize } from '@/hooks/useWindowSize'

const Header: React.FC = () => {
  return (
    <div className="z-10 flex items-end justify-center pt-10">
      <HeaderSVG />
    </div>
  )
}
const MintMachine: React.FC = () => {
  const questionMarkRotateMiniImgUrls = Array(49)
    .fill(1)
    .map((_, idx) => getFrameUrl('question-mark-rotate-mini', idx + 1))

  return (
    <div className="flex items-center justify-center px-24">
      <div className="relative flex h-[1200px] w-[1716px] shrink-0 items-center justify-center">
        <img
          className="absolute h-[1200px] w-[1716px] shrink-0"
          src={getIllustrationUrl('machine-static')}
          alt="machine-static"
        />

        <img
          className="absolute h-[1200px] w-[1716px] shrink-0"
          src={getIllustrationUrl('screen-strips')}
          alt="screen-strips"
        />

        <div className="absolute bottom-[43%] left-[25.8%] z-10">
          <CanvasFrames
            fps={24}
            width={301}
            height={286}
            imgLocalPaths={questionMarkRotateMiniImgUrls}
          />
        </div>

        <div className="absolute inset-x-0 h-full w-full">
          <CanvasFrames
            fps={0.5}
            width={1716}
            height={1200}
            imgLocalPaths={[
              getFrameUrl('lights', 'light-1'),
              getFrameUrl('lights', 'light-2')
            ]}
          />
        </div>

        <div className="absolute bottom-[168px] left-[254px] h-[126px] w-[784px]">
          <Marquee
            speed={200}
            className="relative flex h-full w-full cursor-default items-center justify-center overflow-hidden whitespace-nowrap p-5 font-smb text-[80px] text-yellow2">
            bitSmiley grand minting coming soon !!! bitSmiley granDdminting
            coming soon !!!
          </Marquee>
        </div>

        <div className="absolute bottom-[248px] left-3 flex items-center gap-x-1.5 font-bold">
          <span>
            <CopyRightSVG />
          </span>
          <span className="cursor-default mix-blend-difference">
            bitSmiley team 2023
          </span>
        </div>

        <div className="absolute bottom-[248px] right-[34px] flex items-center gap-x-6 font-bold">
          <span className="cursor-pointer mix-blend-difference">
            [Whitepaper]
          </span>
          <span className="cursor-pointer text-green mix-blend-difference">
            [Twitter]
          </span>
          <span className="cursor-pointer text-green mix-blend-difference">
            [Discord]
          </span>
        </div>

        <div className="absolute left-[834px] top-[380px] flex w-[398px] flex-col gap-y-6">
          <div className="flex flex-col gap-y-3">
            <div className="overflow-hidden whitespace-nowrap text-lg font-bold text-green">
              OVERVIEW------------------------------------------
            </div>
            <div className="flex items-center justify-between text-lg">
              <span>[NAME]</span>
              <span>SMILEY EXPRESS NERO</span>
            </div>
            <div className="flex items-center justify-between text-lg">
              <span>[ISSUE]</span>
              <span>bitSmiley</span>
            </div>
            <div className="flex items-center justify-between text-lg">
              <span>[AMOUNT]</span>
              <span>6000</span>
            </div>
          </div>
          <div className="flex flex-col gap-y-3">
            <div className="overflow-hidden whitespace-nowrap text-lg font-bold text-green">
              STATS---------------------------------------------
            </div>
            <div className="flex items-center justify-between text-lg">
              <span>[NAME]</span>
              <span>????</span>
            </div>
            <div className="flex items-center justify-between text-lg">
              <span>[UTILITY]</span>
              <span>????</span>
            </div>
          </div>
          <div className="flex items-center gap-x-2 text-lg font-bold text-green">
            <span>
              <DotSVG />
            </span>
            <span>MINING COMING SOON...</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const Divider: React.FC<{ title: string; className?: string }> = ({
  title,
  className
}) => {
  return (
    <div
      className={cn(
        'my-[200px] flex cursor-default items-center justify-center px-[12%] py-2.5',
        className
      )}>
      <div className="text-5xl font-bold">+</div>
      <div className="flex flex-1 items-center overflow-hidden text-5xl">
        {Array(30)
          .fill(1)
          .map((_, idx) => (
            <div className="font-bold" key={idx}>
              -
            </div>
          ))}
      </div>
      <span className="px-6 text-5xl">{title}</span>
      <div className="flex flex-1 items-center overflow-hidden">
        {Array(30)
          .fill(1)
          .map((_, idx) => (
            <div className="text-5xl font-bold" key={idx}>
              -
            </div>
          ))}
      </div>
      <div className="text-5xl font-bold">+</div>
    </div>
  )
}
const Inventor: React.FC = () => {
  return (
    <div className="flex cursor-default items-center justify-center gap-x-28">
      <div className="aspect-[251/272] w-[251px] shrink-0">
        <SmileySVG />
      </div>
      <div className="w-[700px]">
        <div className="text-[32px]">Inventor of bitUSD</div>
        <div className="mt-12 text-2xl">
          We are the OG of Bitcoin{' '}
          <span className="text-yellow">stablecoin</span> based on
          over-collateralization, building its peripheral{' '}
          <span className="text-yellow">Fintegra</span> products at the same
          time.
        </div>
        <div className="relative mt-6 h-10 w-32">
          <div className="absolute left-0 top-0 z-50 cursor-pointer bg-blue px-4 py-2 font-bold">
            WHITEPAPER
          </div>
          <div className="absolute left-2 top-2 z-10 h-full w-full bg-blue2"></div>
        </div>
      </div>
    </div>
  )
}
const BackedBy: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-x-40">
      <div className="h-[153px] w-[462px] shrink-0">
        <img src={getIllustrationUrl('okx-logo')} alt="okx" />
      </div>
      <div className="h-[153px] w-[445px] shrink-0">
        <img src={getIllustrationUrl('abcde-logo')} alt="abcde" />
      </div>
    </div>
  )
}
const Articles: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-x-10 pb-40">
      <div className="aspect-square w-[370px] shrink-0 bg-gray-500">
        Article1
      </div>
      <div className="aspect-square w-[370px] shrink-0 bg-gray-500">
        Article1
      </div>
      <div className="aspect-square w-[370px] shrink-0 bg-gray-500">
        Article1
      </div>
    </div>
  )
}

const Main: React.FC = () => {
  const { width } = useWindowSize()
  return (
    <div
      className="inset-0 h-screen w-screen origin-top text-white"
      style={{
        scale: `${(width * 100) / 1920}%`
      }}>
      <img
        src={getIllustrationUrl('bit-space')}
        alt="bit-space"
        style={{
          scale: `${(1920 * 100) / width}%`
        }}
        className="absolute left-0 top-0 z-[-1] w-full origin-top"
      />
      <Header />
      <MintMachine />
      <Divider title="Who is bitSmiley" className="mt-40" />

      <div className="relative">
        <img
          src={getIllustrationUrl('bit-global-1')}
          alt="bit-global-1"
          style={{
            scale: `${(1920 * 100) / width}%`
          }}
          className="absolute left-0 top-0 z-[-1] w-full origin-top"
        />
        <Inventor />
        <Divider title="Backed By" />
      </div>

      <BackedBy />
      <div className="relative">
        <img
          src={getIllustrationUrl('bit-global-2')}
          alt="bit-global-2"
          style={{
            scale: `${(1920 * 100) / width}%`
          }}
          className="absolute bottom-0 left-0 z-[-2] w-full origin-top"
        />
        <Divider title="Articles" />
        <Articles />
      </div>
    </div>
  )
}

export default Main
