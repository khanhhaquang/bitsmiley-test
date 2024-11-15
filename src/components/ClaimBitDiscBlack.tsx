import { useMemo, useState } from 'react'

import { CloseIcon, RightAngleThin } from '@/assets/icons'
import { useUserStakes } from '@/hooks/useUserStakes'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import { Button } from './Button'
import { Image } from './Image'
import { Modal } from './Modal'

const ClaimBitDiscBlack = () => {
  const { userStakes, handleWithdraw, isClaiming, isWithdrawn } =
    useUserStakes()
  const [isOpen, setOpen] = useState(false)

  const claimableNfts = useMemo(() => userStakes || [], [userStakes])

  const onClose = () => {
    setOpen(false)
  }

  if (!claimableNfts.length || isWithdrawn) return null

  return (
    <>
      <div className="group h-[34px] w-full">
        <button
          className={cn(
            'relative flex uppercase cursor-pointer size-full items-center justify-center whitespace-nowrap bg-[#5f5f5f]/30 text-white group-hover:bg-[#929292]/30 group-active:bg-[#929292]/10'
          )}
          onClick={() => {
            setOpen(true)
          }}>
          <span>bitdisc-black</span>
          <RightAngleThin className="absolute left-[-1px] top-[-1px]" />
          <RightAngleThin className="absolute right-[-1px] top-[-1px] rotate-90" />
          <RightAngleThin className="absolute bottom-[-1px] right-[-1px] rotate-180" />
          <RightAngleThin className="absolute bottom-[-1px] left-[-1px] -rotate-90" />
        </button>
      </div>
      <Modal isOpen={isOpen} onClose={onClose} backdrop>
        <div className="relative w-[598px] border border-white/20 bg-black  text-white">
          <div
            className="absolute size-full bg-contain bg-[center_bottom_48px] bg-no-repeat p-[10px] opacity-50"
            style={{
              backgroundImage: `url(${getIllustrationUrl(
                'claim-bit-disc-bg',
                'webp'
              )})`
            }}
          />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white">
            <CloseIcon width={18} height={17} />
          </button>
          <div className="p-[42px]">
            <h2 className="mb-8 text-center font-smb text-2xl uppercase">
              CLAIM BITDISC-BLACK
            </h2>
            <div className="flex flex-col items-center gap-6 ">
              <p className="text-center">
                Dear bitSmiler, below are the bitDisc-Black you have staked.
              </p>
              <div className="relative flex items-center">
                <Image
                  alt="Claimable BitDisc"
                  src={getIllustrationUrl('claimable-bit-disc', 'webp')}
                  className="z-[2] h-[151px] w-[156px]"
                />
                {claimableNfts.length > 1 && (
                  <div className="relative ml-[-100px] ">
                    <Image
                      alt="Remain BitDisc"
                      src={getIllustrationUrl(
                        'remain-claimable-bit-disc',
                        'webp'
                      )}
                      className="h-[151px] w-[156px]"
                    />
                    <div className="absolute right-4 top-[60px] font-pss text-2xl text-cyan">
                      +{claimableNfts.length - 1}
                    </div>
                  </div>
                )}
              </div>
              <Button
                onClick={() => {
                  handleWithdraw((e) => {
                    if (!e) onClose()
                  })
                }}
                className="h-[26px] w-[120px]"
                disabled={isClaiming}>
                {isClaiming ? 'Claiming' : 'Claim'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ClaimBitDiscBlack
