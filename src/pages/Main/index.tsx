import { Image } from '@/components/Image'

import {
  getFrameUrl,
  getIconUrl,
  getIllustrationUrl
} from '@/utils/getImageUrl'
import { useWindowSize } from '@/hooks/useWindowSize'
import { LINKS } from '@/config/links'
import { MintMachine } from './MintMachine'
import { cn } from '@/utils/cn'
import { CanvasFrames } from '@/components/CanvasFrames'
import { useFetchArticles } from '@/hooks/useFetchArticles'
import { ConnectWallet } from '@/components/ConnectWallet'

const Main: React.FC = () => {
  const { width } = useWindowSize()
  return (
    <div className="max-h-screen w-screen">
      <div
        className="relative flex origin-top flex-col items-center justify-center text-white"
        style={{
          scale: `${width >= 1920 ? 100 : (width * 100) / 1920}%`
        }}>
        <SpaceBg />
        <MintMachine />
        <div className="relative">
          <Divider title="Who is bitSmiley" className="mb-[200px] mt-[136px]" />
          <GlobalBg wrapperClassName="top-[400px] origin-top" />
        </div>
        <Inventor />
        <Divider title="Backed By" className="mb-[240px] mt-[400px]" />
        <BackedBy />
        <div className="relative">
          <GlobalBg wrapperClassName="bottom-0" imgClassName="rotate-180" />
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
          <Image src={getIconUrl('coin', 'svg')} />
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
            onClick={() => window.open(LINKS.whitePaper, '__blank')}
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
    <div className="flex items-center justify-center gap-x-40">
      <div className="h-[153px] w-[462px] shrink-0">
        <Image src={getIllustrationUrl('okx-logo')} />
      </div>
      <div className="h-[153px] w-[445px] shrink-0">
        <Image src={getIllustrationUrl('abcde-logo')} />
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
          onClick={() => window.open(i.link, '__blank')}>
          {i.img && <Image className="" src={i.img} />}
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
      <div
        className="flex origin-top-left"
        style={{
          scale: `${width >= 1920 ? 100 : (width * 100) / 1920}%`
        }}>
        <Image src={getIconUrl('header', 'svg')} className="max-h-14" />
      </div>

      <ConnectWallet
        className="flex origin-top-right"
        style={{
          scale: `${width >= 1920 ? 100 : (width * 100) / 1920}%`
        }}
      />
    </div>
  )
}

const Divider: React.FC<{ title: string; className?: string }> = ({
  title,
  className
}) => {
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

const CopyRightAndLinks: React.FC = () => {
  const { width } = useWindowSize()
  return (
    <div
      className="fixed bottom-[75px] left-0 z-50 flex w-full origin-bottom items-end justify-between px-[136px] text-white mix-blend-difference"
      style={{
        padding: `0 ${width >= 1920 ? 136 : (136 / 1920) * width}px`
      }}>
      <div
        className="flex origin-bottom-left items-center gap-x-1.5 font-bold"
        style={{
          scale: `${width >= 1920 ? 100 : (width * 100) / 1920}%`
        }}>
        <span>
          <Image src={getIconUrl('copyright')} />
        </span>
        <span className="cursor-default">bitSmiley team 2024</span>
      </div>
      <div
        className="flex origin-bottom-right flex-col items-end gap-y-1.5 font-bold"
        style={{
          scale: `${width >= 1920 ? 100 : (width * 100) / 1920}%`
        }}>
        <span
          className="cursor-pointer"
          onClick={() => window.open(LINKS.discord, '__blank')}>
          [<span className="hover:underline active:no-underline">Discord</span>]
        </span>
        <span
          className="cursor-pointer"
          onClick={() => window.open(LINKS.twitter, '__blank')}>
          [<span className="hover:underline active:no-underline">Twitter</span>]
        </span>
        <span
          className="cursor-pointer"
          onClick={() => window.open(LINKS.whitePaper, '__blank')}>
          [
          <span className="hover:underline active:no-underline">
            Whitepaper
          </span>
          ]
        </span>
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

export default Main
