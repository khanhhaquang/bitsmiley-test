import { Image } from '@/components/Image'
import { RefObject, useRef } from 'react'
import { getFrameUrl, getIllustrationUrl, openUrl } from '@/utils/getAssetsUrl'
import { useWindowSize } from '@/hooks/useWindowSize'
import { MEDIA } from '@/config/links'
import { cn } from '@/utils/cn'
import { CanvasFrames } from '@/components/CanvasFrames'
import { useFetchArticles } from '@/hooks/useFetchArticles'
import { CopyRightAndLinks } from '@/components/CopyRightAndLinks'
import { useOnScreen } from '@/hooks/useOnScreen'
import { CoinIcon } from '@/assets/icons'
import { StakingMachine } from '@/components/StakingMachine'
import { Header } from '@/components/Header'
import { Button } from '@/components/Button'

export const StakingPage: React.FC = () => {
  const whoIsBitSmileyRef = useRef<HTMLDivElement>(null)
  const isOnScreen = useOnScreen(whoIsBitSmileyRef)
  const { width } = useWindowSize()

  return (
    <div className="relative flex flex-col items-center overflow-x-hidden">
      <div
        className="relative flex w-full origin-top flex-col items-center justify-center text-white"
        style={{
          padding: `0 ${width >= 1920 ? 136 : (136 / 1920) * width}px`
        }}>
        <SpaceBg />
        <StakingMachine hideScrollDown={isOnScreen} />
        <div className="relative" id="whoIsBitSmiley">
          <Divider
            title="Who is bitSmiley"
            className="mb-[200px] mt-[136px]"
            titleRef={whoIsBitSmileyRef}
          />
          <GlobalBg wrapperClassName="top-[280px] origin-top" />
        </div>
        <Inventor />
        <Divider title="Backed By" className="mb-[240px] mt-[400px]" />
        <BackedBy />
        <div className="relative">
          <GlobalBg wrapperClassName="top-[150px]" imgClassName="rotate-180" />
          <Divider title="Articles" className="mb-[200px] mt-[400px]" />
        </div>
        <div className="pb-[280px]">
          <Articles />
        </div>
      </div>
      <Header wallet />
      {/* <CopyRightAndLinks /> */}
    </div>
  )
}

const Inventor: React.FC = () => {
  return (
    <div className="flex cursor-default flex-wrap items-center justify-center gap-x-28 gap-y-10">
      <div className="shrink-0">
        <CanvasFrames
          fps={8}
          width={215}
          height={230}
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
      <div className="flex h-[230px] w-[700px] flex-col justify-between">
        <div className="flex items-center justify-start gap-x-2 text-[32px]">
          <span>Inventor of bitUSD</span>
          <span className="pb-1">
            <CoinIcon />
          </span>
        </div>
        <div>
          <div className="mb-4 text-2xl">
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
  return (
    <div className="flex flex-col flex-wrap items-center gap-5">
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
    </div>
  )
}
const Articles: React.FC = () => {
  const { items } = useFetchArticles()
  return (
    <div className="flex flex-wrap items-center justify-center gap-10">
      {items?.slice(0, 3).map((i, idx) => (
        <div
          key={idx}
          className="aspect-square w-[370px] shrink-0 cursor-pointer"
          onClick={() => openUrl(i.link)}>
          {i.img && (
            <Image
              className="aspect-square w-[370px] object-cover"
              src={i.img}
            />
          )}
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
  const { width } = useWindowSize()
  return (
    <div
      className={cn('my-[200px] flex items-center justify-center', className)}>
      <span
        className="text-4xl font-bold"
        style={{
          fontSize: `${(width / 1920) * 36}px`
        }}>
        +
      </span>
      <div
        className="flex flex-1 items-center overflow-hidden text-4xl"
        style={{
          fontSize: `${(width / 1920) * 36}px`
        }}>
        {Array(30)
          .fill(1)
          .map((_, idx) => (
            <span className="font-bold" key={idx}>
              -
            </span>
          ))}
      </div>
      <h2
        ref={titleRef}
        className="px-6 py-2.5 text-4xl"
        style={{
          fontSize: `${(width / 1920) * 36}px`
        }}>
        {title}
      </h2>
      <div
        className="flex flex-1 items-center overflow-hidden text-4xl"
        style={{
          fontSize: `${(width / 1920) * 36}px`
        }}>
        {Array(30)
          .fill(1)
          .map((_, idx) => (
            <span className="font-bold" key={idx}>
              -
            </span>
          ))}
      </div>
      <span
        className="text-4xl font-bold"
        style={{
          fontSize: `${(width / 1920) * 36}px`
        }}>
        +
      </span>
    </div>
  )
}

const GlobalBg: React.FC<{
  wrapperClassName?: string
  imgClassName?: string
}> = ({ wrapperClassName, imgClassName }) => {
  const { width } = useWindowSize()
  return (
    <div
      className={cn(
        'absolute left-0 right-0 top-0 z-[-1] origin-top mix-blend-lighten',
        wrapperClassName
      )}
      style={{
        scale: `${width >= 1920 ? 100 : (1920 * 100) / width}%`
      }}>
      <div className="relative">
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
    <div className="absolute inset-x-0 top-0 z-[-1] aspect-[1976/1344] w-full">
      <Image src={getIllustrationUrl('bit-space')} width="100%" height="100%" />
    </div>
  )
}
