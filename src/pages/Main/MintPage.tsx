import { Image } from '@/components/Image'
import { RefObject, useRef } from 'react'
import { getFrameUrl, getIllustrationUrl, openUrl } from '@/utils/getAssetsUrl'
import { useWindowSize } from '@/hooks/useWindowSize'
import { MEDIA } from '@/config/links'
import { cn } from '@/utils/cn'
import { CanvasFrames } from '@/components/CanvasFrames'
import { useFetchArticles } from '@/hooks/useFetchArticles'
import { ConnectWallet } from '@/components/ConnectWallet'
import { CopyRightAndLinks } from '@/components/CopyRightAndLinks'
import { useOnScreen } from '@/hooks/useOnScreen'
import { CoinIcon, HeaderIcon } from '@/assets/icons'
import { MintMachine } from '@/components/MintMachine'

export const MintPage: React.FC = () => {
  const whoIsBitSmileyRef = useRef<HTMLDivElement>(null)
  const { width } = useWindowSize()
  const isOnScreen = useOnScreen(whoIsBitSmileyRef)
  return (
    <div className="max-h-screen w-screen">
      <div
        className="relative flex origin-top flex-col items-center justify-center text-white"
        style={{
          scale: `${width >= 1920 ? 100 : (width * 100) / 1920}%`
        }}>
        <SpaceBg />
        <MintMachine hideScrollDown={isOnScreen} />
        <div className="relative">
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
      <Header />
      <CopyRightAndLinks />
    </div>
  )
}

const Inventor: React.FC = () => {
  return (
    <div className="flex cursor-default items-center justify-center gap-x-28">
      <div className="h-[230px] w-[215px] shrink-0">
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
          <div
            onClick={() => openUrl(MEDIA.whitePaper)}
            className={cn(
              'inline-block h-10 cursor-pointer bg-blue px-5 py-2 font-bold shadow-whitepaper-button hover:bg-blue1 active:shadow-none',
              'active:shadow-none active:translate-x-1.5 active:translate-y-1.5 active:bg-blue'
            )}>
            Whitepaper
          </div>
        </div>
      </div>
    </div>
  )
}
const BackedBy: React.FC = () => {
  return (
    <div>
      <div className="mb-12 flex items-center justify-center gap-x-40">
        <div className="h-[153px] w-[288px] shrink-0 mix-blend-lighten">
          <Image src={getIllustrationUrl('okx-logo')} />
        </div>
        <div className="h-[153px] w-[445px] shrink-0">
          <Image src={getIllustrationUrl('abcde-logo')} />
        </div>
      </div>

      <div className="flex w-[1067px] items-center justify-between">
        <Image src={getIllustrationUrl('cms-logo')} />
        <Image src={getIllustrationUrl('arkstream-logo')} />
        <Image src={getIllustrationUrl('7updao-logo')} />
      </div>

      <div className="flex w-[1067px] items-center justify-between">
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
    <div className="flex items-center justify-center gap-x-10">
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

const Header: React.FC = () => {
  const { width } = useWindowSize()
  return (
    <div
      className="absolute left-0 top-[50px] z-50 flex w-screen origin-top items-start justify-between text-white"
      style={{
        padding: `0 ${width >= 1920 ? 136 : (136 / 1920) * width}px`
      }}>
      <HeaderIcon
        className="flex h-[54px] origin-top-left"
        style={{
          scale: `${width >= 1920 ? 100 : (width * 100) / 1920}%`
        }}
      />

      <ConnectWallet
        className="flex origin-top-right"
        style={{
          scale: `${width >= 1920 ? 100 : (width * 100) / 1920}%`
        }}
      />
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
      style={{
        scale: `${width >= 1920 ? 100 : (1920 * 100) / width}%`,
        padding: `0 ${width / 8}px`
      }}
      className={cn('my-[200px] flex items-center justify-center', className)}>
      <div
        className="text-4xl font-bold"
        style={{
          fontSize: `${(width / 1920) * 36}px`
        }}>
        +
      </div>
      <div
        className="flex flex-1 items-center overflow-hidden text-4xl"
        style={{
          fontSize: `${(width / 1920) * 36}px`
        }}>
        {Array(30)
          .fill(1)
          .map((_, idx) => (
            <div className="font-bold" key={idx}>
              -
            </div>
          ))}
      </div>
      <div
        ref={titleRef}
        className="px-6 py-2.5 text-4xl"
        style={{
          fontSize: `${(width / 1920) * 36}px`
        }}>
        {title}
      </div>
      <div
        className="flex flex-1 items-center overflow-hidden text-4xl"
        style={{
          fontSize: `${(width / 1920) * 36}px`
        }}>
        {Array(30)
          .fill(1)
          .map((_, idx) => (
            <div className="font-bold" key={idx}>
              -
            </div>
          ))}
      </div>
      <div
        className="text-4xl font-bold"
        style={{
          fontSize: `${(width / 1920) * 36}px`
        }}>
        +
      </div>
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
  const { width } = useWindowSize()
  return (
    <Image
      src={getIllustrationUrl('bit-space')}
      style={{
        scale: `${width >= 1920 ? 100 : (1920 * 100) / width}%`
      }}
      className="absolute inset-x-0 top-0 z-[-1] w-screen origin-top"
    />
  )
}
