import { useEffect, useMemo, useState } from 'react'
import { Address, Chain } from 'viem'

import {
  AirdropIcon,
  AirdropModalTitleLeftIcon,
  AirdropModalTitleRightIcon,
  CloseIcon,
  InputIndicatorIcon,
  RightAngleThin
} from '@/assets/icons'
import { Image } from '@/components/Image'
import { chainsIconUrl } from '@/config/chain'
import { useAirdrop } from '@/hooks/useAirdrop'
import { useProjectInfo } from '@/hooks/useProjectInfo'
import { useSupportedChains } from '@/hooks/useSupportedChains'
import { cn } from '@/utils/cn'

import { Modal } from './Modal'
import Typewriter from './Typewriter'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'

type Token = {
  chainId: number
  airdropAddress: Address
}

export const Airdrop: React.FC = () => {
  const { projectInfo } = useProjectInfo()

  const airdropAddresses = projectInfo?.web3Info.reduce<string[]>(
    (pre, curr) => {
      pre.push(...(curr?.contract?.airdrop || []))
      return pre
    },
    []
  )

  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!airdropAddresses?.length) return null

  return (
    <>
      <AirdropModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <AirdropButton onClick={() => setIsModalOpen(true)} />
    </>
  )
}

const AirdropButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group absolute top-[calc(200%+24px)] size-full cursor-pointer">
      <div
        className={cn(
          'relative flex size-full items-center justify-center whitespace-nowrap bg-yellow4/25 uppercase text-yellow5 group-hover:bg-yellow4/50 group-active:text-opacity-50 group-active:bg-yellow4/10'
        )}>
        <span className="flex items-center justify-center gap-x-1">
          <AirdropIcon />
          AIRDROP
        </span>
        <RightAngleThin className="absolute left-[-1px] top-[-1px]" />
        <RightAngleThin className="absolute right-[-1px] top-[-1px] rotate-90" />
        <RightAngleThin className="absolute bottom-[-1px] right-[-1px] rotate-180" />
        <RightAngleThin className="absolute bottom-[-1px] left-[-1px] -rotate-90" />
      </div>
    </div>
  )
}

const AirdropModal: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  const [token, setToken] = useState<Token>()

  const { supportedChains } = useSupportedChains()
  const chain = useMemo(
    () => supportedChains.find((c) => c.id === token?.chainId),
    [supportedChains, token?.chainId]
  )

  const { isClaimed, canClaim, isLoading, claim } = useAirdrop(
    token?.airdropAddress
  )

  useEffect(() => {
    if (!isOpen) setToken(undefined)
  }, [isOpen])

  const onClaim = () => {
    claim()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop={false}>
      <div className="flex flex-col">
        <div className="relative flex w-full items-center justify-between gap-x-1 border border-blue bg-[#120E1F]">
          <AirdropModalTitleLeftIcon className="w-full flex-1" />
          <span className="font-smb text-xs uppercase text-blue [text-shadow:1.5px_0_0_rgba(38,72,239,0.25)]">
            claim airdrops
          </span>
          <AirdropModalTitleRightIcon className="w-full flex-1" />

          <button
            onClick={onClose}
            className="absolute right-0 top-0 flex aspect-square h-full cursor-pointer items-center justify-center bg-black text-blue hover:text-blue1">
            <CloseIcon width={13} height={13} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-y-6 border border-blue bg-black p-6">
          <SelectToken chain={chain} onSelect={setToken} />
          {!!token && (
            <div className="flex flex-col gap-y-3">
              <div className="font-ibmr text-sm text-white/70">
                {isClaimed
                  ? 'You have claimed'
                  : canClaim
                    ? 'You can claim'
                    : 'You cannot claim this airdrop'}
              </div>

              {(canClaim || isClaimed) && (
                <div className="flex items-center justify-center font-ibmb text-white">
                  {isLoading ? (
                    <Typewriter
                      loop
                      wrapperClassName="min-w-10"
                      speed={300}
                      cursor={false}
                      renderNodes={() => '...'}
                    />
                  ) : (
                    'xxxxx'
                  )}{' '}
                  {chain?.nativeCurrency.symbol}
                </div>
              )}
            </div>
          )}

          {canClaim && (
            <button
              onClick={onClaim}
              className={cn(
                'cursor-pointer w-[124px]',
                'text-nowrap border border-white/50 bg-white/10 py-1 font-ibmb text-sm text-white/70 shadow-[0_0_5px_1px_rgba(255,255,255,0.12)] hover:bg-white/20 hover:text-white active:bg-white/5 active:text-white/50',
                'disabled:bg-white/10 disabled:text-white/20  disabled:cursor-not-allowed'
              )}>
              Claim
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}

const SelectToken: React.FC<{
  chain?: Chain
  onSelect: (t: Token) => void
}> = ({ chain, onSelect }) => {
  const { projectInfo } = useProjectInfo()
  const { supportedChains } = useSupportedChains()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex w-[294px] cursor-pointer items-center justify-between border border-white/70 p-2 font-smb text-xs text-white/50 [text-shadow:1.5px_0_0_rgba(0,0,0,0.25)] hover:border-white hover:text-white">
          {chain?.id ? (
            <>
              <span className="flex items-center gap-x-1.5 font-smb text-xs">
                <Image src={chainsIconUrl[chain.id]} width={16} height={16} />
                {chain.nativeCurrency.symbol}
              </span>
            </>
          ) : (
            'select a toke'
          )}
          <InputIndicatorIcon className="rotate-90" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        sideOffset={0}
        className="w-[294px] cursor-default rounded-none border-none bg-black p-0">
        {projectInfo?.web3Info
          .filter((item) => !!item.contract.airdrop.length)
          .map((item) =>
            item.contract.airdrop.map((airdropAddress) => (
              <DropdownMenuItem
                key={airdropAddress}
                onSelect={() => {
                  onSelect({
                    chainId: item.chainId,
                    airdropAddress
                  })
                }}
                className="cursor-pointer rounded-none border border-white/70 bg-black px-2 py-1.5 text-white/50 hover:border-white hover:bg-black hover:text-white active:border-white active:bg-black active:text-white">
                <span className="flex items-center gap-x-1.5 font-smb text-xs">
                  <Image
                    src={chainsIconUrl[item.chainId]}
                    width={16}
                    height={16}
                  />
                  {
                    supportedChains.find((c) => c.id === item.chainId)
                      ?.nativeCurrency.symbol
                  }
                </span>
              </DropdownMenuItem>
            ))
          )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
