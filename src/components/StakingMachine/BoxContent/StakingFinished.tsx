import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { PlayerInfo } from '../Common'
import { Image } from '@/components/Image'
import { BitGold, RightAngle } from '@/assets/icons'
import { Button } from '@/components/Button'
import stakingAbi from '@/abi/Staking.json'
import { useWriteContract } from 'wagmi'
import { useStoreActions } from '@/hooks/useStoreActions'
import useContractAddresses from '@/hooks/useNetworkAddresses'

export const StakingFinished: React.FC = () => {
  const { addTransaction } = useStoreActions()
  const contractAddresses = useContractAddresses()
  const { writeContractAsync } = useWriteContract()

  const handleWithdraw = async () => {
    if (contractAddresses?.staking) {
      try {
        const txid = await writeContractAsync({
          abi: stakingAbi,
          functionName: 'withdraw',
          address: contractAddresses?.staking
        })
        addTransaction(txid)
        console.log(txid)
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <div className="pt-4">
      <div className="mb-10 flex items-end gap-[104px]">
        <PlayerInfo />
        <div className="whitespace-nowrap font-smb">Staking Finished</div>
        <PlayerInfo className="invisible" />
      </div>

      <div className="flex w-full items-start justify-center gap-x-6">
        <div className="relative aspect-square w-[163px]">
          <Image
            src={getIllustrationUrl('bit-mint', 'webp')}
            className="border-[3px] border-white"
          />
          <Button
            size="xs"
            className="absolute left-1/2 top-1/2 z-10 w-[100px] -translate-x-1/2 -translate-y-1/2"
            onClick={handleWithdraw}>
            Retrieve
          </Button>
          <div className="absolute left-0 top-0 h-full w-full bg-black/50"></div>
        </div>

        <div className="relative flex h-[163px] w-[311px] flex-col items-center justify-between bg-yellow2 px-6 pb-6 pt-4 text-sm">
          <div className="flex items-center gap-x-3 font-smb text-base text-black">
            <BitGold />
            bitgold X54
          </div>

          <div className="text-center text-[15px] text-black">
            All the bitGold is awarded to your record. Retrieve your NFT before
            you can join future staking.
          </div>

          <RightAngle className="absolute left-0 top-0 text-black" />
          <RightAngle className="absolute right-0 top-0 rotate-90 text-black" />
          <RightAngle className="absolute bottom-0 right-0 rotate-180 text-black" />
          <RightAngle className="absolute bottom-0 left-0 -rotate-90 text-black" />
        </div>
      </div>
    </div>
  )
}
