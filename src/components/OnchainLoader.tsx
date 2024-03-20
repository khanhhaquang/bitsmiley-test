import './OnchainLoader.scss'

export const OnChainLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div
        id="onchain-loader"
        className="h-[82px] w-[128px] shrink-0 bg-onchainLoading bg-left bg-no-repeat"
      />
      <p className="mt-10 font-psm text-sm">
        We are fetching your onchain data...
      </p>
    </div>
  )
}
