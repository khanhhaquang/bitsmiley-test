import { RefObject, useRef } from 'react'

import { BitUsdPixelIcon, CoinIcon } from '@/assets/icons'
import { Button } from '@/components/Button'
import { CanvasFrames } from '@/components/CanvasFrames'
import { Image } from '@/components/Image'
import { StakingMachine } from '@/components/StakingMachine'
import { MEDIA } from '@/config/links'
import { useFetchArticles } from '@/hooks/useFetchArticles'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useOnScreen } from '@/hooks/useOnScreen'
import { cn } from '@/utils/cn'
import { getFrameUrl, getIllustrationUrl, openUrl } from '@/utils/getAssetsUrl'

export const StakingPage: React.FC = () => {
  const whoIsBitSmileyRef = useRef<HTMLDivElement>(null)
  const isOnScreen = useOnScreen(whoIsBitSmileyRef)

  return (
    <div className="relative flex flex-col items-center overflow-x-hidden">
      <div className="relative flex w-full flex-col items-center justify-center text-white">
        <SpaceBg />
        <StakingMachine hideScrollDown={isOnScreen} />
        <div className="relative" id="whoIsBitSmiley">
          <Divider
            title="Who is bitSmiley"
            className="mb-[200px] mt-[136px] sm:mb-20 sm:mt-[-200px]"
            titleRef={whoIsBitSmileyRef}
          />
          <GlobalBg wrapperClassName="top-[280px] sm:top-[320px]" />
        </div>
        <Inventor />
        <Divider
          title="Backed By"
          className="mb-[240px] mt-[400px] sm:mb-20 sm:mt-[140px]"
        />
        <BackedBy />
        <div className="relative">
          <GlobalBg
            wrapperClassName="top-[150px] sm:top-20"
            imgClassName="rotate-180"
          />
          <Divider
            title="Articles"
            className="mb-[200px] mt-[400px] sm:mb-20 sm:mt-[140px]"
          />
        </div>
        <div className="flex w-[1423px]  justify-center pb-[280px] sm:w-full sm:px-6 sm:pb-[100px]">
          <Articles />
        </div>
      </div>
    </div>
  )
}

const Inventor: React.FC = () => {
  const { isMobile } = useMediaQuery()
  return (
    <div className="flex cursor-default flex-wrap items-center justify-center gap-x-28 gap-y-10 sm:gap-y-7">
      <div className="shrink-0 sm:flex sm:w-full sm:justify-center sm:gap-x-7">
        <CanvasFrames
          fps={8}
          width={isMobile ? 125 : 215}
          height={isMobile ? 134 : 230}
          imgLocalPaths={[
            ...Array(14)
              .fill(1)
              .map(() => getFrameUrl('smiley-logo', 'smiley-1', 'svg')),
            getFrameUrl('smiley-logo', 'smiley-2', 'svg'),
            getFrameUrl('smiley-logo', 'smiley-1', 'svg'),
            getFrameUrl('smiley-logo', 'smiley-2', 'svg')
          ]}
        />
        <img
          alt="bitusd"
          src={getIllustrationUrl('large-bit-usd', 'webp')}
          width={125}
          height={135}
          className="hidden sm:block"
        />
      </div>
      <div className="flex h-[230px] w-[700px] flex-col justify-between sm:h-auto sm:w-[286px] sm:text-center">
        <div className="flex items-center justify-start gap-x-2 text-[32px] sm:mb-9 sm:justify-center sm:text-center sm:font-psm sm:text-lg sm:font-bold sm:text-[#FF8D00]">
          <span>Inventor of bitUSD</span>
          <span className="pb-1">
            <CoinIcon className="sm:hidden" />
            <BitUsdPixelIcon className="hidden sm:block" />
          </span>
        </div>
        <div>
          <div className="mb-4 text-2xl sm:mb-6 sm:text-justify sm:text-base">
            We are the OG of Bitcoin{' '}
            <span className="text-yellow">stablecoin</span> based on
            over-collateralization, building its peripheral{' '}
            <span className="text-yellow">Fintegra</span> products at the same
            time.
          </div>
          <Button
            onClick={() => openUrl(MEDIA.whitePaper)}
            className="inline-block h-10 bg-blue text-white shadow-whitepaper-button hover:bg-blue1">
            Whitepaper
          </Button>
        </div>
      </div>
    </div>
  )
}
const BackedBy: React.FC = () => {
  const { isMobile } = useMediaQuery()

  return (
    <div className="flex flex-col flex-wrap items-center gap-5">
      {isMobile ? (
        <div className="scrollbar-none flex w-screen flex-nowrap items-center justify-start gap-x-12 overflow-auto px-6">
          <Image src={getIllustrationUrl('okx-logo')} width={186} height={98} />
          <Image
            src={getIllustrationUrl('abcde-logo')}
            width={287}
            height={98}
          />
          <Image
            src={getIllustrationUrl('cms-logo')}
            width={220}
            height={100}
          />
          <Image
            src={getIllustrationUrl('arkstream-logo')}
            width={236}
            height={68}
          />
          <Image
            src={getIllustrationUrl('7updao-logo')}
            width={374}
            height={72}
          />
          <Image
            src={getIllustrationUrl('mtcapital-logo')}
            width={274}
            height={72}
          />
          <Image
            src={getIllustrationUrl('candaq-logo')}
            width={248}
            height={60}
          />
          <Image
            src={getIllustrationUrl('foresight-logo')}
            width={208}
            height={55}
          />
          <Image
            src={getIllustrationUrl('mt-logo', 'webp')}
            width={245}
            height={61}
          />
          <Image
            src={getIllustrationUrl('veris-logo', 'webp')}
            width={230}
            height={82}
          />
          <Image
            src={getIllustrationUrl('side-door-logo', 'webp')}
            width={202}
            height={65}
          />
          <Image
            src={getIllustrationUrl('kucoin-logo', 'webp')}
            width={162}
            height={48}
          />
          <Image
            src={getIllustrationUrl('tpc-logo', 'webp')}
            width={124}
            height={37}
          />
          <Image
            src={getIllustrationUrl('pragma-logo', 'webp')}
            width={158}
            height={38}
          />
          <Image
            src={getIllustrationUrl('newtribe-logo', 'webp')}
            width={173}
            height={44}
          />
          <Image
            src={getIllustrationUrl('kinetic-logo', 'webp')}
            width={381}
            height={50}
          />
          <Image
            src={getIllustrationUrl('perlone-logo', 'webp')}
            width={140}
            height={62}
          />
          <Image
            src={getIllustrationUrl('rbc-logo', 'webp')}
            width={140}
            height={62}
          />
          <Image
            src={getIllustrationUrl('guildqb-logo', 'webp')}
            width={164}
            height={40}
          />
          <Image
            src={getIllustrationUrl('nxgen-logo', 'webp')}
            width={130}
            height={35}
          />
          <Image
            src={getIllustrationUrl('dutch-logo', 'webp')}
            width={103}
            height={51}
          />
          <Image
            src={getIllustrationUrl('aegis-logo', 'webp')}
            width={216}
            height={33}
          />
          <Image
            src={getIllustrationUrl('zc-logo', 'webp')}
            width={54}
            height={46}
          />
          <Image
            src={getIllustrationUrl('skyland-logo', 'webp')}
            width={86}
            height={68}
          />
          <Image
            src={getIllustrationUrl('ce-logo', 'webp')}
            width={67}
            height={64}
          />
          <Image
            src={getIllustrationUrl('cypher-logo', 'webp')}
            width={82}
            height={61}
          />
          <Image
            src={getIllustrationUrl('comma3-logo', 'webp')}
            width={156}
            height={72}
          />
        </div>
      ) : (
        <>
          <div className="mb-12 flex flex-wrap items-center justify-center gap-x-40 gap-y-10">
            <div className="h-[153px] shrink-0 mix-blend-lighten">
              <Image src={getIllustrationUrl('okx-logo')} />
            </div>
            <div className="h-[153px] w-[445px] shrink-0">
              <Image src={getIllustrationUrl('abcde-logo')} />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6">
            <Image src={getIllustrationUrl('cms-logo')} />
            <Image src={getIllustrationUrl('arkstream-logo')} />
            <Image src={getIllustrationUrl('7updao-logo')} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6">
            <Image src={getIllustrationUrl('mtcapital-logo')} />
            <Image src={getIllustrationUrl('candaq-logo')} />
            <Image src={getIllustrationUrl('foresight-logo')} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6">
            <Image src={getIllustrationUrl('mt-logo', 'webp')} />
            <Image src={getIllustrationUrl('veris-logo', 'webp')} />
            <Image src={getIllustrationUrl('side-door-logo', 'webp')} />
            <Image src={getIllustrationUrl('kucoin-logo', 'webp')} />
            <Image src={getIllustrationUrl('tpc-logo', 'webp')} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6">
            <Image src={getIllustrationUrl('pragma-logo', 'webp')} />
            <Image src={getIllustrationUrl('newtribe-logo', 'webp')} />
            <Image src={getIllustrationUrl('kinetic-logo', 'webp')} />
            <Image src={getIllustrationUrl('perlone-logo', 'webp')} />
            <Image src={getIllustrationUrl('rbc-logo', 'webp')} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6">
            <Image src={getIllustrationUrl('guildqb-logo', 'webp')} />
            <Image src={getIllustrationUrl('nxgen-logo', 'webp')} />
            <Image src={getIllustrationUrl('dutch-logo', 'webp')} />
            <Image src={getIllustrationUrl('aegis-logo', 'webp')} />
            <Image src={getIllustrationUrl('zc-logo', 'webp')} />
            <Image src={getIllustrationUrl('skyland-logo', 'webp')} />
            <Image src={getIllustrationUrl('ce-logo', 'webp')} />
            <Image src={getIllustrationUrl('cypher-logo', 'webp')} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6">
            <Image src={getIllustrationUrl('comma3-logo', 'webp')} />
          </div>
        </>
      )}
    </div>
  )
}
const Articles: React.FC = () => {
  const { items } = useFetchArticles()
  return (
    <div
      className={cn(
        'grid grid-cols-3 items-center justify-start gap-12',
        'sm:flex sm:w-screen sm:gap-x-6 sm:overflow-x-auto sm:px-0 scrollbar-none sm:flex-nowrap'
      )}>
      {items?.slice(0, 4).map((i, idx) => (
        <div
          key={idx}
          className="flex aspect-square w-[379px] shrink-0 cursor-pointer flex-col justify-between border-4 border-blue/40 p-7 hover:bg-blue/20 sm:w-[210px] sm:p-4"
          onClick={() => openUrl(i.link)}>
          {i.img && (
            <Image
              className="aspect-[320/168] w-[full] object-cover"
              src={i.img}
            />
          )}
          <div className="line-clamp-4 text-ellipsis text-2xl text-blue sm:text-sm">
            {i.title}
          </div>
        </div>
      ))}
    </div>
  )
}

const Divider: React.FC<{
  titleRef?: RefObject<HTMLDivElement> | null
  title: string
  className?: string
}> = ({ title, className, titleRef }) => {
  const { isMobile } = useMediaQuery()
  return (
    <div
      className={cn('my-[200px] flex items-center justify-center', className)}>
      <span className="text-4xl font-bold">+</span>
      <div className="flex flex-1 items-center overflow-hidden text-4xl">
        {Array(isMobile ? 3 : 30)
          .fill(1)
          .map((_, idx) => (
            <span className="font-bold" key={idx}>
              -
            </span>
          ))}
      </div>
      <h2 ref={titleRef} className="px-6 py-2.5 text-4xl sm:text-2xl">
        {title}
      </h2>
      <div className="flex flex-1 items-center overflow-hidden text-4xl">
        {Array(isMobile ? 3 : 30)
          .fill(1)
          .map((_, idx) => (
            <span className="font-bold" key={idx}>
              -
            </span>
          ))}
      </div>
      <span className="text-4xl font-bold">+</span>
    </div>
  )
}

const GlobalBg: React.FC<{
  wrapperClassName?: string
  imgClassName?: string
}> = ({ wrapperClassName, imgClassName }) => {
  return (
    <div
      className={cn(
        'absolute left-0 right-0 top-0 z-[-1] mix-blend-lighten',
        'sm:w-[500px] sm:left-1/2 sm:-translate-x-1/2',
        wrapperClassName
      )}>
      <div className="relative w-full">
        <Image
          src={getIllustrationUrl('bit-global')}
          className={cn('w-full', imgClassName)}
        />
      </div>
    </div>
  )
}

const SpaceBg: React.FC = () => {
  return (
    <div className="absolute inset-x-0 top-0 z-[-1] aspect-[1976/1344] w-full sm:hidden">
      <Image src={getIllustrationUrl('bit-space')} width="100%" height="100%" />
    </div>
  )
}
