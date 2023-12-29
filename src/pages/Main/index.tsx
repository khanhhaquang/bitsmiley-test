import { Image } from '@/components/Image'

import {
  getFrameUrl,
  getIconUrl,
  getIllustrationUrl
} from '@/utils/getImageUrl'
import { useWindowSize } from '@/hooks/useWindowSize'
import { Divider } from './Divider'
import { LINKS } from '@/config/links'
import { MintMachine } from './MintMachine'
import { cn } from '@/utils/cn'
import { CanvasFrames } from '@/components/CanvasFrames'

const Header: React.FC = () => {
  return (
    <div className="z-10 flex items-end justify-center pt-[68px]">
      <Image src={getIconUrl('header')} />
    </div>
  )
}

const Inventor: React.FC = () => {
  return (
    <div className="flex cursor-default items-center justify-center gap-x-28">
      <div className="aspect-[251/272] w-[251px] shrink-0">
        <CanvasFrames
          fps={8}
          width={252}
          height={273}
          imgLocalPaths={[
            ...Array(14)
              .fill(1)
              .map(() => getFrameUrl('smiley-logo', `smiley-1`)),
            getFrameUrl('smiley-logo', `smiley-2`),
            getFrameUrl('smiley-logo', `smiley-1`),
            getFrameUrl('smiley-logo', `smiley-2`)
          ]}
        />
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
        <div
          onClick={() => window.open(LINKS.whitePaper, '__blank')}
          className={cn(
            'mt-6 h-10 w-32 cursor-pointer bg-blue px-4 py-2 font-bold shadow-whitepaper-button hover:bg-blue1 focus:shadow-none',
            'active:shadow-none active:translate-x-1.5 active:translate-y-1.5 active:bg-blue'
          )}>
          Whitepaper
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
      className="relative h-screen w-screen origin-top text-white"
      style={{
        scale: `${width >= 1920 ? 100 : (width * 100) / 1920}%`
      }}>
      <Image
        src={getIllustrationUrl('bit-space')}
        style={{
          scale: `${width >= 1920 ? 100 : (1920 * 100) / width}%`
        }}
        className="absolute left-0 top-0 z-[-1] w-screen origin-top"
      />
      <Image
        src={getIllustrationUrl('bit-global-2')}
        style={{
          scale: `${width >= 1920 ? 100 : (1920 * 100) / width}%`
        }}
        className="absolute left-0 top-[580px] z-[-1] w-screen origin-top mix-blend-lighten"
      />
      <Header />
      <MintMachine />
      <Divider title="Who is bitSmiley" className="mt-40" />

      <div className="relative">
        <Image
          src={getIllustrationUrl('bit-global-1')}
          style={{
            scale: `${width >= 1920 ? 100 : (1920 * 100) / width}%`
          }}
          className="absolute left-0 top-0 z-[-1] w-screen origin-top"
        />
        <Inventor />
        <Divider title="Backed By" className="mb-[280px]" />
      </div>

      <BackedBy />
      <div className="relative">
        <Image
          src={getIllustrationUrl('bit-global-2')}
          style={{
            scale: `${width >= 1920 ? 100 : (1920 * 100) / width}%`
          }}
          className="absolute bottom-0 left-0 z-[-2] w-screen origin-top"
        />
        <Divider title="Articles" className="mt-[320px]" />
        <Articles />
      </div>
    </div>
  )
}

export default Main
