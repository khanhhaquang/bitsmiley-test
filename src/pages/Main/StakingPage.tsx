import { RefObject, useRef } from 'react'

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
            className="mb-[200px] mt-[136px] sm:my-[72px]"
            titleRef={whoIsBitSmileyRef}
          />
          <GlobalBg wrapperClassName="top-[280px] sm:top-[320px]" />
        </div>
        <Inventor />
        <Divider
          title="Backed By"
          className="mb-[240px] mt-[400px] sm:my-[72px]"
        />
        <BackedBy />
        <div className="relative">
          <GlobalBg
            wrapperClassName="top-[150px] sm:top-20"
            imgClassName="rotate-180"
          />
          <Divider
            title="Articles"
            className="mb-[200px] mt-[400px] sm:my-[72px]"
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
    <div className="flex cursor-default flex-col items-center justify-center gap-y-[72px] lg:flex-row lg:gap-x-[72px]">
      <div className="flex w-[432px] shrink-0 flex-wrap items-center justify-center gap-x-[35px] gap-y-[10px] sm:w-[221px] sm:gap-x-7">
        <div className="flex w-full justify-center lg:block lg:w-fit">
          <CanvasFrames
            fps={8}
            width={isMobile ? 92 : 177}
            height={isMobile ? 99 : 200}
            imgLocalPaths={[
              ...Array(14)
                .fill(1)
                .map(() => getFrameUrl('smiley-logo', 'smiley-1', 'svg')),
              getFrameUrl('smiley-logo', 'smiley-2', 'svg'),
              getFrameUrl('smiley-logo', 'smiley-1', 'svg'),
              getFrameUrl('smiley-logo', 'smiley-2', 'svg')
            ]}
          />
        </div>
        <img
          alt="bitusd"
          src={getIllustrationUrl('large-bit-usd', 'webp')}
          width={isMobile ? 92 : 182}
          height={isMobile ? 92 : 192}
        />
        <img
          alt="bitcoin"
          src={getIllustrationUrl('large-bitcoin', 'webp')}
          width={isMobile ? 92 : 182}
          height={isMobile ? 92 : 182}
          className=""
        />
      </div>
      <div className="flex h-auto w-[700px] flex-col justify-between gap-x-[72px] gap-y-12 sm:w-full sm:gap-y-6 sm:px-[10px] sm:text-center">
        <div className="flex flex-col gap-y-6 sm:gap-y-[6px]">
          <div
            className="flex items-center justify-center gap-x-2 font-smb text-[32px] uppercase text-[#FF8D00] sm:gap-x-[2px] sm:text-center sm:text-xs lg:justify-start"
            style={{
              textShadow: '0px 4px 0px #692800'
            }}>
            <span>Inventor of bitUSD</span>
            <img
              alt="bitusd"
              src={getIllustrationUrl('small-bit-usd', 'webp')}
              width={isMobile ? 12 : 34}
              height={isMobile ? 12 : 34}
            />
          </div>
          <div className="text-center text-2xl sm:text-xs lg:text-start">
            We are the OG of Bitcoin stablecoin based on over-collateralization,
            building its peripheral Fintegra products at the same time.
          </div>
        </div>

        <div className="flex flex-col gap-y-3 sm:gap-y-1">
          <div
            className="flex items-center justify-center gap-x-2 font-smb text-[32px] uppercase leading-[55px] text-pink sm:gap-x-[2px] sm:text-center sm:text-lg sm:leading-6 lg:justify-start"
            style={{
              textShadow: '0px 4px 0px #8F0044'
            }}>
            <span className="text-[55px] sm:text-2xl">30+</span>
            Million
          </div>
          <div className="text-center text-2xl sm:text-xs lg:text-start">
            With 30+ million TVL in bitSmiley stablecoin protocol, bitUSD is the
            biggest stablecoin in BTC ecosystem.
          </div>
        </div>

        <div className="flex w-full justify-center lg:block lg:w-fit">
          <Button
            onClick={() => openUrl(MEDIA.whitePaper)}
            className="inline-block h-10 w-[141px] bg-blue uppercase text-white shadow-whitepaper-button hover:bg-blue1">
            Whitepaper
          </Button>
        </div>
      </div>
    </div>
  )
}
const BackedBy: React.FC = () => {
  return (
    <div className="flex flex-col flex-wrap items-center gap-5 sm:w-full sm:gap-0 sm:px-[10px]">
      <div className="mb-12 flex flex-wrap items-center justify-center gap-x-40 sm:mb-4 sm:gap-x-[53px] ">
        <div className="h-[153px] w-[288px] mix-blend-lighten sm:h-[50px] sm:w-[96px] ">
          <Image src={getIllustrationUrl('okx-logo')} />
        </div>
        <div className="h-[153px] w-[445px] shrink-0 sm:h-[50px] sm:w-[148px]">
          <Image src={getIllustrationUrl('abcde-logo')} />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6 sm:mb-1 sm:w-full sm:justify-between sm:gap-0">
        <Image src={getIllustrationUrl('cms-logo')} className="sm:h-[44px]" />
        <Image
          src={getIllustrationUrl('arkstream-logo')}
          className="sm:h-[25px]"
        />
        <Image
          src={getIllustrationUrl('7updao-logo')}
          className="sm:h-[21px] sm:w-[111px]"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6 sm:mb-4 sm:w-full sm:justify-between sm:gap-0">
        <Image
          src={getIllustrationUrl('mtcapital-logo')}
          className="sm:h-[24px]"
        />
        <Image
          src={getIllustrationUrl('candaq-logo')}
          className="sm:h-[24px]"
        />
        <Image
          src={getIllustrationUrl('foresight-logo')}
          className="sm:h-[24px]"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6 sm:mb-2 sm:w-full sm:justify-between sm:gap-0">
        <Image
          src={getIllustrationUrl('mt-logo', 'webp')}
          className="sm:h-[20px]"
        />
        <Image
          src={getIllustrationUrl('veris-logo', 'webp')}
          className="sm:h-[27px]"
        />
        <Image
          src={getIllustrationUrl('side-door-logo', 'webp')}
          className="sm:h-[21px]"
        />
        <Image
          src={getIllustrationUrl('kucoin-logo', 'webp')}
          className="sm:h-[16px]"
        />
        <Image
          src={getIllustrationUrl('tpc-logo', 'webp')}
          className="sm:h-[13px]"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6 sm:mb-2 sm:w-full sm:justify-between sm:gap-0">
        <Image
          src={getIllustrationUrl('pragma-logo', 'webp')}
          className="sm:h-[13px]"
        />
        <Image
          src={getIllustrationUrl('newtribe-logo', 'webp')}
          className="sm:h-[14px]"
        />
        <Image
          src={getIllustrationUrl('kinetic-logo', 'webp')}
          className="sm:h-[16px]"
        />
        <Image
          src={getIllustrationUrl('perlone-logo', 'webp')}
          className="sm:h-[20px]"
        />
        <Image
          src={getIllustrationUrl('rbc-logo', 'webp')}
          className="sm:h-[18px]"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6 sm:mb-2 sm:w-full sm:justify-between sm:gap-0">
        <Image
          src={getIllustrationUrl('guildqb-logo', 'webp')}
          className="sm:h-[13px]"
        />
        <Image
          src={getIllustrationUrl('nxgen-logo', 'webp')}
          className="sm:h-[11px]"
        />
        <Image
          src={getIllustrationUrl('dutch-logo', 'webp')}
          className="sm:h-[17px]"
        />
        <Image
          src={getIllustrationUrl('aegis-logo', 'webp')}
          className="sm:h-[11px]"
        />
        <Image
          src={getIllustrationUrl('zc-logo', 'webp')}
          className="sm:h-[15px]"
        />
        <Image
          src={getIllustrationUrl('skyland-logo', 'webp')}
          className="sm:h-[22px]"
        />
        <Image
          src={getIllustrationUrl('ce-logo', 'webp')}
          className="sm:h-[21px]"
        />
        <Image
          src={getIllustrationUrl('cypher-logo', 'webp')}
          className="sm:h-[27px]"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6">
        <Image
          src={getIllustrationUrl('comma3-logo', 'webp')}
          className="sm:h-[24px]"
        />
      </div>
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

export const Divider: React.FC<{
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
