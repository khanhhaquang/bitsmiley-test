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
import { useFetchArticles } from '@/hooks/useFetchArticles'
import { CopyRightAndLinks } from './CopyRightAndLinks'
import { ConnectWallet } from '@/components/ConnectWallet'

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
            'mt-6 h-10 w-32 cursor-pointer bg-blue px-5 py-2 font-bold shadow-whitepaper-button hover:bg-blue1 active:shadow-none',
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
    <div className="flex items-center justify-center gap-x-40 py-10">
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
    <div className="flex items-center justify-center gap-x-12">
      {items?.slice(0, 3).map((i, idx) => (
        <div
          key={idx}
          className="aspect-square w-[325px] shrink-0 cursor-pointer"
          onClick={() => window.open(i.link, '__blank')}>
          {i.img && <Image className="" src={i.img} />}
        </div>
      ))}
    </div>
  )
}

const Main: React.FC = () => {
  const { width } = useWindowSize()
  return (
    <div className="max-h-screen w-screen">
      <div
        className="relative origin-top text-white"
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

        <div
          className="absolute left-0 top-[600px] z-[-1] w-screen origin-top mix-blend-lighten"
          style={{
            scale: `${width >= 1920 ? 100 : (1920 * 100) / width}%`
          }}>
          <div className="relative">
            <div className="absolute inset-x-0 h-full w-full bg-gradient-to-b from-transparent via-transparent to-black"></div>
            <Image
              src={getIllustrationUrl('bit-global-2')}
              className="w-full"
            />
          </div>
        </div>

        <div
          className="z-10 flex items-end justify-center pt-[68px]"
          style={{
            paddingTop: `${width >= 1920 ? 68 : (1920 / width) * 68}px`
          }}>
          <Image src={getIconUrl('header', 'svg')} className="h-16 w-full" />
        </div>

        <MintMachine />

        <div className="relative">
          <Divider title="Who is bitSmiley" className="mb-[280px] mt-[200px]" />

          <div
            className="absolute left-0 top-0 z-[-1] w-screen origin-top"
            style={{
              scale: `${width >= 1920 ? 100 : (1920 * 100) / width}%`
            }}>
            <div className="relative">
              <div className="absolute inset-x-0 h-full w-full bg-gradient-to-t from-transparent via-transparent to-black"></div>
              <Image
                src={getIllustrationUrl('bit-global-1')}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <Inventor />
        <Divider title="Backed By" className="mb-[280px] mt-[320px]" />

        <BackedBy />

        <div className="relative">
          <div
            style={{
              scale: `${width >= 1920 ? 100 : (1920 * 100) / width}%`
            }}
            className="absolute bottom-0 left-0 z-[-2] w-screen origin-top">
            <div className="relative">
              <div className="absolute inset-x-0 h-full w-full bg-gradient-to-b from-transparent via-transparent to-black"></div>
              <Image
                src={getIllustrationUrl('bit-global-2')}
                className="w-full"
              />
            </div>
          </div>

          <Divider title="Articles" className="mt-[330px]" />
        </div>

        <div className="pb-[340px]">
          <Articles />
        </div>
      </div>

      <div
        className="absolute right-[136px]"
        style={{
          top: `${width >= 1920 ? 80 : (80 / 1920) * width}px`,
          right: `${width >= 1920 ? 136 : (136 / 1920) * width}px`
        }}>
        <ConnectWallet
          style={{
            scale: `${width >= 1920 ? 100 : (width * 100) / 1920}%`
          }}
          className="origin-bottom-right"
        />
      </div>

      <CopyRightAndLinks />
    </div>
  )
}

export default Main
