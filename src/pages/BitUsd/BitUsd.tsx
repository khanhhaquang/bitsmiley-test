import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TitleBox } from '@/components/Title'
import { LinkOutIcon } from '@/assets/icons'
import { useUserInfo } from '@/hooks/useUserInfo'
import { useChainId } from 'wagmi'
import { WEBSITE } from '@/config/links'
import { openUrl, getOpenUrl } from '@/utils/getAssetsUrl'
import { cn } from '@/utils/cn'
import { formatDecimal, formatAmountThousands } from '@/utils/formatter'
import { Image } from '@/components/Image'
import LoadingAnimation from '@/components/LoadingAnimation'
import { UserService } from '@/services/user'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'

interface Vault {
  isOpenVault: boolean
  network: string
  maxLTV: string
  borrowRate: string
  vaultFloor: number
  liquidity: string
  chainId: number
  collateralRatio: number
  collateralLocked: number
  totalDebt: string
}

const BitUsd: React.FC = () => {
  const navigate = useNavigate()
  const { address, isConnected } = useUserInfo()
  const chainId = useChainId()
  const [availableMintingPairs, setAvailableMintingPairs] = useState<Vault[]>(
    []
  )
  const [myVaults, setMyVaults] = useState<Vault[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const getMintingPairs = async () => {
    if (address && isConnected) {
      const { code, data } = await UserService.getMintingPairs.call(address)
      console.log(data)
      if (code == 0) {
        setIsLoading(false)
        const array1: Array<Vault> = [],
          array2: Array<Vault> = []
        data != undefined &&
          data.forEach((v: Vault) => {
            v.isOpenVault ? array1.push(v) : array2.push(v)
          })
        setMyVaults(array1)
        setAvailableMintingPairs(array2)
      }
    }
  }

  useEffect(() => {
    if (address) {
      getMintingPairs()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address])

  const goToMyVaults = async (item: Vault) => {
    if (item.chainId === chainId) {
      navigate(`./my-vault/${chainId}`)
    }
  }
  const goToOpenVault = async (item: Vault) => {
    if (item.chainId === chainId) {
      navigate(`./vault/${chainId}`)
    }
  }
  if (!isConnected) return <NotConnected />
  if (isLoading) return <Loading />
  return (
    <div>
      <div>
        {myVaults.length > 0 && (
          <>
            <div className="mx-auto mt-[164px] max-w-[1434px]">
              <TitleBox message="My Vaults" isWhite={true} />
            </div>
            <MyVaults
              list={myVaults}
              handleClick={(item: Vault) => goToMyVaults(item)}
            />
          </>
        )}
        {availableMintingPairs.length > 0 && (
          <>
            <div className=" mx-auto mt-[164px] max-w-[1434px]">
              <TitleBox message="Available Minting Pairs" />
            </div>
            <AvailableMintingPairs
              list={availableMintingPairs}
              handleClick={(item: Vault) => goToOpenVault(item)}
            />
          </>
        )}
        <p className="mb-[177px] mt-[194px] flex justify-center text-white/5">
          More assets coming soon...
        </p>
      </div>
    </div>
  )
}

const Loading: React.FC = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center text-white">
      <LoadingAnimation text="loading"></LoadingAnimation>
    </div>
  )
}

const NotConnected: React.FC = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center border-white text-white">
      <div className="flex flex-col items-center justify-center gap-y-12 border border-white/50 bg-black bg-connect-modal bg-cover bg-no-repeat p-[42px]">
        <div className="font-ppnb text-5xl">Connect wallet first</div>
        <div className="max-w-[330px] text-center font-ibmr text-sm">
          connect your wallet to conitnue.
        </div>
      </div>
    </div>
  )
}

const AvailableMintingPairs: React.FC<{
  list: Vault[]
  handleClick: (item: Vault) => void
}> = ({ list, handleClick }) => {
  const renderedItems = list.map(
    (item: Vault, index: number) =>
      !item.isOpenVault && (
        <dd className="border-b-2 border-dashed border-white/50" key={index}>
          <ul
            className={cn('flex items-center px-3 py-6 font-ibmr text-white')}>
            <li className="w-[140px] whitespace-nowrap">
              {item.network == 'Merlin'
                ? 'wBTC1 - bitUSD'
                : index == 0
                  ? 'wBTC2 - bitUSD'
                  : `wBTC${index + 1} - bitUSD`}
            </li>
            <li
              className={cn(
                'flex flex-1 items-center justify-end gap-x-1.5 text-right cursor-pointer'
              )}
              onClick={() =>
                item.network == 'Merlin' && openUrl(WEBSITE.merlinchain)
              }>
              {item.network} <LinkOutIcon />
            </li>
            <li className="flex-1 text-right">
              {formatDecimal((Number(item.maxLTV) * 100).toFixed(1), 1)}%
            </li>
            <li className="flex-1 text-right">
              {formatDecimal((Number(item.borrowRate) * 100).toFixed(1), 1)}%
            </li>
            <li className="flex-1 text-right ">
              {formatAmountThousands((item.vaultFloor || 0).toString(), 2)} $
            </li>
            <li className="flex-1 text-right">
              {formatAmountThousands((item.liquidity || 0).toString(), 4)} BTC
            </li>
            <li className="ml-[50] flex-1 text-right">
              <button
                className={cn(
                  ' cursor-pointer h-[34px] w-[133px] bg-white font-ibmb text-gray-950'
                )}
                onClick={() => handleClick(item)}>
                Mint bitUSD
              </button>
            </li>
          </ul>
        </dd>
      )
  )

  return (
    <>
      <div className="">
        <dl className="mx-auto mt-[50px] max-w-[1220px]">
          <dt className="border-b-2 border-dashed border-white/50 pb-[24px]">
            <ul className="flex justify-between font-ibmb [&>li]:text-white/70">
              <li className="w-[140px]"></li>
              <li className="flex-1 text-right">Network</li>
              <li className="flex-1 text-right">
                <Tooltip>
                  <TooltipTrigger>
                    <span>Max LTV ⓘ</span>
                  </TooltipTrigger>
                  <TooltipContent>Max Loan to Value Ratio</TooltipContent>
                </Tooltip>
              </li>
              <li className="flex-1 text-right">
                <Tooltip>
                  <TooltipTrigger>
                    <span>Stability Fee ⓘ</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    The annual Stability Fee for vaults, calculated based on
                    your outstanding vault debt.
                  </TooltipContent>
                </Tooltip>
              </li>
              <li className="flex-1 text-right">
                <Tooltip>
                  <TooltipTrigger>
                    <span>Vault floor ⓘ</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    Minimum amount of bitUSD required to be minted from a Vault
                  </TooltipContent>
                </Tooltip>
              </li>
              <li className="flex-1 text-right">
                <Tooltip>
                  <TooltipTrigger>
                    <span>Liquidity ⓘ</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    Amount of bitUSD available to be generated from BTC
                    according the global protocol debt ceiling
                  </TooltipContent>
                </Tooltip>
              </li>
              <li className="ml-[50] flex-1 text-center"></li>
            </ul>
          </dt>
          {renderedItems}
        </dl>
      </div>
    </>
  )
}

const MyVaults: React.FC<{
  list: Array<Vault>
  handleClick: (item: Vault) => void
}> = ({ list, handleClick }) => {
  const renderedItems = list.map(
    (item: Vault, index: number) =>
      item.isOpenVault && (
        <dd
          className="relative border-b-2 border-dashed border-white/50"
          key={index}>
          <ul className="flex items-center px-[12px] py-[24px] font-ibmr text-white">
            <li className="flex-1">
              {item.network == 'Merlin'
                ? 'wBTC1 - bitUSD'
                : index == 0
                  ? 'wBTC2 - bitUSD'
                  : `wBTC${index + 1} - bitUSD`}
            </li>
            <li
              className={cn(
                'flex flex-1 items-center justify-center text-center cursor-pointer'
              )}
              onClick={() =>
                item.network == 'Merlin' && openUrl(WEBSITE.merlinchain)
              }>
              {item.network} <LinkOutIcon />
            </li>
            <li className="mr-[10px] flex-1 text-right">
              {formatDecimal(item.collateralRatio * 100, 1)}%
            </li>
            <li className="mr-[10px] flex-1 text-right">
              {formatAmountThousands(
                (item.collateralLocked || 0).toString(),
                4
              )}{' '}
              BTC
            </li>
            <li className="mr-[10px] flex-1 text-right">
              {formatAmountThousands((item.totalDebt || 0).toString(), 4)} $
            </li>
            <li className="flex-1 text-right">
              <button
                className={cn(
                  ' cursor-pointer h-[34px] w-[133px] bg-white font-ibmb text-gray-950'
                )}
                onClick={() => handleClick(item)}>
                Enter Vault
              </button>
            </li>
          </ul>
          {item.collateralRatio <= 1 && item.collateralRatio > 0 && (
            <div className="absolute bottom-1 flex items-center font-ibmr text-[14px]">
              <Image
                src={getOpenUrl('warning')}
                className="mr-[8px] w-[24px]"
              />
              <span className="text-red1">
                This wallet is in the process of liquidation. Repay or deposit
                BTC to avoid liquidation
              </span>
            </div>
          )}
        </dd>
      )
  )

  return (
    <div>
      <dl className="mx-auto mt-[50px] max-w-[1220px] ">
        <dt className="border-b-2 border-dashed border-white/50 pb-[24px]">
          <ul className="flex justify-between font-ibmb [&>li]:text-white/70">
            <li className="flex-1"></li>
            <li className="flex-1 text-center">Network</li>
            <li className="mr-[10px] flex-1 text-right">
              <Tooltip>
                <TooltipTrigger>
                  <span>Health Factor ⓘ</span>
                </TooltipTrigger>
                <TooltipContent>
                  Indicates the health status of an account. Any vaults that
                  drop below 1 face liquidation.
                </TooltipContent>
              </Tooltip>
            </li>
            <li className="mr-[10px] flex-1 text-right">Collateral Locked</li>
            <li className="mr-[10px] flex-1 text-right">
              <Tooltip>
                <TooltipTrigger>
                  <span>Total Debt ⓘ </span>
                </TooltipTrigger>
                <TooltipContent>bitUSD debt + Stability Fee</TooltipContent>
              </Tooltip>
            </li>
            <li className="w-64 flex-1 text-center"></li>
          </ul>
        </dt>
        {renderedItems}
      </dl>
    </div>
  )
}

export default BitUsd
