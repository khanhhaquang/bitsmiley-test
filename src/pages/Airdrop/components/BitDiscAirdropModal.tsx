import { CloseIcon } from '@/assets/icons'
import { ActionButton } from '@/components/ActionButton'
import { Image } from '@/components/Image'
import { Modal } from '@/components/Modal'
import { AirdropClaimType, useAirdropClaim } from '@/hooks/useAirdropClaim'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

export const BitDiscAirdropModal: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  const { canClaim, isClaimed, amount, handleClaim, isActive } =
    useAirdropClaim(AirdropClaimType.BitDisc)

  return (
    <Modal
      backdrop={false}
      isOpen={isOpen}
      onClose={() => {
        onClose()
      }}>
      <div
        className={cn(
          'relative flex min-w-[555px] flex-col items-center border bg-black/75 px-12 py-9 pb-6 border-[#EAC641]'
        )}>
        <button
          className="absolute right-3 top-3 cursor-pointer text-white/70"
          onClick={onClose}>
          <CloseIcon width={13} height={13} />
        </button>

        <Image
          src={getIllustrationUrl('bind-wallet-modal-decorator-left', 'webp')}
          width={170}
          height={160}
          className="pointer-events-none absolute bottom-0 left-0 origin-bottom-left scale-[70%]"
        />
        <Image
          src={getIllustrationUrl('bind-wallet-modal-decorator-right', 'webp')}
          width={168}
          height={158}
          className="pointer-events-none absolute bottom-0 right-0 origin-bottom-right scale-[70%]"
        />
        <div className="flex flex-col items-center gap-y-6 text-center">
          <h2 className="text-center font-ibmb text-2xl uppercase text-[#FA0]">
            bit-Disc Black Airdrop
          </h2>
          <p className="w-[435px] text-center font-ibmr text-sm text-white">
            Your wallet address is eligible to some unclaimed bit-Disc Black
            airdrop. Claim your $SMILE now!
          </p>

          <div className="flex items-center gap-3 font-ibmr text-2xl">
            <Image
              src={getIllustrationUrl('white-smile-icon', 'webp')}
              width={28}
              height={39}
              className="pointer-events-none"
            />
            {amount ?? 0}
          </div>
          <ActionButton
            className="h-[30px] w-[110px] bg-white/70 font-ibmb text-sm text-black hover:bg-white hover:text-black active:bg-white/60 active:text-black"
            disabled={!isActive || !canClaim || isClaimed || amount <= 0}
            onClick={() => {
              handleClaim('Claim bitDisc airdrop', (error) => {
                if (!error) {
                  onClose()
                }
              })
            }}>
            {isClaimed ? 'Claimed' : 'Claim'}
          </ActionButton>
        </div>
      </div>
    </Modal>
  )
}
