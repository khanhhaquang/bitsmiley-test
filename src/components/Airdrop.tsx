import { useEffect, useMemo, useState } from 'react'
import { Address, Chain } from 'viem'
import { useChainId, useSwitchChain } from 'wagmi'

import {
  AirdropIcon,
  AirdropModalTitleLeftIcon,
  AirdropModalTitleRightIcon,
  CloseIcon,
  InputIndicatorIcon,
  RightAngleThin
} from '@/assets/icons'
import { Image } from '@/components/Image'
import { Modal } from '@/components/Modal'
import Typewriter from '@/components/Typewriter'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { chainsIconUrl } from '@/config/chain'
import { useAirdrop } from '@/hooks/useAirdrop'
import { useProjectInfo } from '@/hooks/useProjectInfo'
import { useSupportedChains } from '@/hooks/useSupportedChains'
import { cn } from '@/utils/cn'

type Token = {
  chainId: number
  airdropAddress: Address
  name?: string
  symbol?: string
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
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const [token, setToken] = useState<Token>()

  const { supportedChains } = useSupportedChains()
  const chain = useMemo(
    () => supportedChains.find((c) => c.id === token?.chainId),
    [supportedChains, token?.chainId]
  )

  const {
    airdropProofAndAmount,
    isClaimed,
    canClaim,
    isLoading,
    isLoadingAirdropProofAndAmount,
    isClaiming,
    isRefetching,
    claim
  } = useAirdrop(token?.chainId, token?.airdropAddress)

  useEffect(() => {
    if (!isOpen) setToken(undefined)
  }, [isOpen])

  useEffect(() => {
    if (token && chainId !== token.chainId) {
      switchChain(
        { chainId: token.chainId },
        {
          onError: () => {
            onClose()
            console.error('Switching network failed')
          }
        }
      )
    }
  }, [chainId, onClose, switchChain, token])

  const onClaim = async () => {
    if (isClaiming) return
    await claim()
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
          <SelectToken
            chain={chain}
            selectedToken={token}
            onSelect={setToken}
          />
          {!!token && (
            <div className="flex flex-col gap-y-3">
              <div className="font-ibmr text-sm text-white/70">
                {isLoading || isRefetching
                  ? '...Loading'
                  : isClaimed
                    ? 'You have claimed'
                    : canClaim
                      ? 'You can claim'
                      : 'You cannot claim this airdrop'}
              </div>

              {(canClaim || isClaimed) && (
                <div className="flex items-center justify-center font-ibmb text-white">
                  {isLoadingAirdropProofAndAmount ? (
                    <Typewriter
                      loop
                      wrapperClassName="min-w-10"
                      speed={300}
                      cursor={false}
                      renderNodes={() => '...'}
                    />
                  ) : (
                    airdropProofAndAmount?.amount
                  )}{' '}
                  {token?.symbol}
                </div>
              )}
            </div>
          )}

          {!isLoading && !isRefetching && canClaim && !isClaimed && (
            <button
              onClick={onClaim}
              disabled={isClaiming}
              className={cn(
                'cursor-pointer w-[124px]',
                'text-nowrap border border-white/50 bg-white/10 py-1 font-ibmb text-sm text-white/70 shadow-[0_0_5px_1px_rgba(255,255,255,0.12)] hover:bg-white/20 hover:text-white active:bg-white/5 active:text-white/50',
                'disabled:bg-white/10 disabled:text-white/20  disabled:cursor-not-allowed'
              )}>
              {isClaiming ? 'Claiming...' : 'Claim'}
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}

const SelectToken: React.FC<{
  chain?: Chain
  selectedToken?: Token
  onSelect: (t: Token) => void
}> = ({ chain, onSelect, selectedToken }) => {
  const { projectInfo } = useProjectInfo()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex w-[294px] cursor-pointer items-center justify-between border border-white/70 p-2 font-smb text-xs text-white/50 [text-shadow:1.5px_0_0_rgba(0,0,0,0.25)] hover:border-white hover:text-white">
          {selectedToken?.name && !!chain?.id ? (
            <>
              <span className="flex items-center gap-x-1.5 font-smb text-xs">
                <Image src={chainsIconUrl[chain.id]} width={16} height={16} />
                {selectedToken.name}
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
              <SelectItem
                key={airdropAddress}
                chainId={item.chainId}
                airdropAddress={airdropAddress}
                onSelect={(t: Token) => onSelect(t)}
              />
            ))
          )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const SelectItem: React.FC<{
  chainId: number
  airdropAddress: Address
  onSelect: (t: Token) => void
}> = ({ chainId, airdropAddress, onSelect }) => {
  const { tokenInfo } = useAirdrop(chainId, airdropAddress)

  return (
    <DropdownMenuItem
      key={airdropAddress}
      onSelect={() =>
        onSelect({
          chainId,
          airdropAddress,
          name: tokenInfo?.name,
          symbol: tokenInfo?.symbol
        })
      }
      className="cursor-pointer rounded-none border border-white/70 bg-black px-2 py-1.5 text-white/50 hover:border-white hover:bg-black hover:text-white active:border-white active:bg-black active:text-white">
      <span className="flex min-h-4 items-center gap-x-1.5 font-smb text-xs">
        <Image src={chainsIconUrl[chainId as number]} width={16} height={16} />
        {!tokenInfo?.name ? (
          <Typewriter
            loop
            wrapperClassName="min-w-10"
            speed={300}
            cursor={false}
            renderNodes={() => '...'}
          />
        ) : (
          tokenInfo?.name
        )}
      </span>
    </DropdownMenuItem>
  )
}
