import HeaderSVG from '@/assets/icons/header.svg?react'
import SmileySVG from '@/assets/icons/smiley.svg?react'
import { CanvasFrames } from '@/components/CanvasFrames'

const Header: React.FC = () => {
  return (
    <div className="z-10 flex h-24 items-end justify-center">
      <HeaderSVG />
    </div>
  )
}
const Machine: React.FC = () => {
  return (
    <div className="mt-12 flex items-center justify-center px-24">
      <div className="relative flex aspect-[1716/1200] w-[1716px] items-center justify-center">
        <img
          className="absolute aspect-[1716/1200] w-[1716px] outline outline-pink-200"
          src="./src/assets/illustrations/machine-static.png"
          alt="machine-static"
        />
      </div>
    </div>
  )
}
const Divider: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="my-40 flex items-center justify-center px-[12%] py-2.5">
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
      <span className="px-6 text-6xl">{title}</span>
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
    <div className="flex items-center justify-center gap-x-28 px-[22%]">
      <div className="aspect-[251/272] w-[251px] shrink-0">
        <SmileySVG />
      </div>
      <div className="">
        <div className="text-[32px]">Inventor of bitUSD</div>
        <div className="mt-12 text-2xl">
          We are the OG of Bitcoin{' '}
          <span className="text-yellow">stablecoin</span> based on
          over-collateralization, building its peripheral{' '}
          <span className="text-yellow">Fintegra</span> products at the same
          time.
        </div>
        <div className="relative mt-6 inline-block bg-blue px-4 py-2 font-bold">
          WHITEPAPER
          <div className="absolute left-2 top-2 z-[-1] h-full w-full bg-blue2"></div>
        </div>
      </div>
    </div>
  )
}
const BackedBy: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-x-40 px-[22%]">
      <div className="h-40 flex-1 bg-gray-500">OKX</div>
      <div className="flex h-40 flex-1 items-center justify-center gap-x-10">
        <div className="h-full w-full bg-gray-500">OKX2</div>
        <div className="h-full w-full bg-gray-500">OKX3</div>
      </div>
    </div>
  )
}
const Articles: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-x-10 px-[20%] pb-40">
      <div className="aspect-square w-full bg-gray-500">Article1</div>
      <div className="aspect-square w-full bg-gray-500">Article2</div>
      <div className="aspect-square w-full bg-gray-500">Article3</div>
    </div>
  )
}

const Main: React.FC = () => {
  return (
    <div className="relative inset-0 h-screen w-screen bg-black text-white">
      {/* <div className="absolute left-0 top-0 z-0 w-full">
        <img src="./src/assets/illustrations/bit-space.png" alt="bit-space" />
      </div> */}

      <CanvasFrames
        width={301}
        height={286}
        totalFrame={49}
        imgLocalPaths={Array(49)
          .fill(1)
          .map(
            (_, idx) =>
              `./src/assets/frames/question-mark-rotate-mini/${idx + 1}.png`
          )}
      />

      <Header />
      <Machine />
      <Divider title="Who is bitSmiley" />
      <Inventor />
      <Divider title="Backed By" />
      <BackedBy />
      <Divider title="Articles" />
      <Articles />
    </div>
  )
}

export default Main
