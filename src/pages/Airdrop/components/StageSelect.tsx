import { Image } from '@/components/Image'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { formatNumberWithSeparator } from '@/utils/number'

import './PreSeasonStakeModal.scss'
import { ArrowLeftDoubleIcon, ArrowRightDoubleIcon } from '@/assets/icons'

const StageSelect: React.FC = () => (
  <div className="relative">
    <h2
      className="mt-[45px] text-center text-[78px] uppercase text-yellow3"
      style={{
        WebkitTextStrokeWidth: 0.5,
        WebkitTextStrokeColor: '#EAC641'
      }}>
      Airdrop
    </h2>

    <div className="mt-[86px] flex w-[787px] flex-col gap-y-10">
      <div className="w-full border-[0.6px] border-[#FA0]">
        <div
          className="flex h-[31px] items-center bg-[#FA0] pl-4 font-smb text-black"
          style={{
            textShadow: '1.5px 0px 0px rgba(0, 0, 0, 0.25)'
          }}>
          YOUR TOTAL AIRDROP
        </div>

        <div className="flex h-[84px] items-center justify-between px-4">
          <p className="flex items-center gap-x-3 text-4xl font-bold text-[#FA0]">
            <Image
              src={getIllustrationUrl('smile-icon', 'webp')}
              className="h-[48px] w-[54px]"
            />
            {formatNumberWithSeparator(30291.19)}
          </p>

          <button className="text-[#E0A828] underline hover:opacity-80 active:opacity-50">
            Check my journey
          </button>
        </div>
      </div>

      <div className="flex"></div>

      <button className="mx-auto flex items-center gap-x-2 text-[#B2B2B2] hover:text-[#fff] active:text-white/50">
        <ArrowLeftDoubleIcon width={13} height={9} />
        I want to claim unlocked airdrop
        <ArrowRightDoubleIcon width={13} height={9} />
      </button>
    </div>
  </div>
)

export default StageSelect
