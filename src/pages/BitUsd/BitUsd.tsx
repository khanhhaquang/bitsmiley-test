import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/Header'
import { TitleBox } from '@/components/Title'
import { LinkOutIcon } from '@/assets/icons'
import { useUserInfo } from '@/hooks/useUserInfo'
import { vaultsInfoService } from '@/services/vaultsInfo'
import Tooltip from '@/components/Tooltip'
import { useChainId } from 'wagmi'

interface Vault {
  isOpenVault: boolean
  network: string
  maxLTV: number
  borrowRate: number
  minSize: number
  liquidity: number
  chainId: number
  collateralRatio: number
  collateralLocked: number
  totalDebt: number
}

const BitUsd: React.FC = () => {
  const navigate = useNavigate()
  const { address, isConnected } = useUserInfo()
  const chainId = useChainId()
  const [mintingPairs, setMintingPairs] = useState<Vault[]>([])
  const [myVaults, setMyVaults] = useState<Vault[]>([])

  const getMintingPairs = async () => {
    if (address && isConnected) {
      try {
        const data =
          await vaultsInfoService.getMintingPairsRequest.call(address)
        const array1: Array<Vault> = [],
          array2: Array<Vault> = []
        data.data.forEach((v: Vault) => {
          v.isOpenVault ? array1.push(v) : array2.push(v)
        })
        setMyVaults(array1)
        setMintingPairs(array2)
      } catch (err) {
        console.log(err)
      }
    }
  }

  useEffect(() => {
    getMintingPairs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  return (
    <div>
      <Header wallet />
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
        {mintingPairs.length > 0 && (
          <>
            <div className=" mx-auto mt-[164px] max-w-[1434px]">
              <TitleBox message="Available Minting Pairs" />
            </div>
            <AvailableMintingPairs
              list={mintingPairs}
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

const AvailableMintingPairs: React.FC<{
  list: Vault[]
  handleClick: (item: Vault) => void
}> = ({ list, handleClick }) => {
  const renderedItems = list.map(
    (item: Vault, index: number) =>
      !item.isOpenVault && (
        <dd className="border-b-2 border-dashed border-white/50" key={index}>
          <ul className="flex items-center px-3 py-6 font-ibmr text-white">
            <li className="w-[140px] whitespace-nowrap">
              {item.network == 'Merlin'
                ? 'wBTC1 - bitUSD'
                : index == 0
                  ? 'wBTC2 - bitUSD'
                  : `wBTC${index + 1} - bitUSD`}
            </li>
            <li className="flex flex-1 items-center justify-end gap-x-1.5 text-right">
              {item.network} <LinkOutIcon />
            </li>
            <li className="flex-1 text-right">{item.maxLTV * 100}%</li>
            <li className="flex-1 text-right">{item.borrowRate * 100}%</li>
            <li className="flex-1 text-right ">{item.minSize} $</li>
            <li className="flex-1 text-right">{item.liquidity} BTC</li>
            <li className="ml-[50] flex-1 text-right">
              <button
                className="h-[34px] w-[133px] bg-white font-ibmb text-gray-950"
                onClick={() => handleClick(item)}>
                Mint BitUSD
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
                <Tooltip text="MAX LTV">
                  <span>Max LTV ⓘ</span>
                </Tooltip>
              </li>
              <li className="flex-1 text-right">Borrow rate ⓘ</li>
              <li className="flex-1 text-right">Min Size ⓘ </li>
              <li className="flex-1 text-right">Liquidity ⓘ </li>
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
        <dd className="border-b-2 border-dashed border-white/50" key={index}>
          <ul className="flex items-center px-[12px] py-[24px] font-ibmr text-white">
            <li className="flex-1">
              {item.network == 'Merlin'
                ? 'wBTC1 - bitUSD'
                : index == 0
                  ? 'wBTC2 - bitUSD'
                  : `wBTC${index + 1} - bitUSD`}
            </li>
            <li className="flex flex-1 items-center justify-center text-center">
              {item.network} <LinkOutIcon />
            </li>
            <li className="mr-[10px] flex-1 text-right">
              {item.collateralRatio * 100}%
            </li>
            <li className="mr-[10px] flex-1 text-right">
              {item.collateralLocked} BTC
            </li>
            <li className="mr-[10px] flex-1 text-right">{item.totalDebt} $</li>
            <li className="flex-1 text-right">
              <button
                className="h-[34px] w-[133px] bg-white font-ibmb text-gray-950"
                onClick={() => handleClick(item)}>
                Enter Vault
              </button>
            </li>
          </ul>
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
            <li className="mr-[10px] flex-1 text-right">Health Factor ⓘ</li>
            <li className="mr-[10px] flex-1 text-right">Collateral Locked</li>
            <li className="mr-[10px] flex-1 text-right">Total Debt ⓘ </li>
            <li className="w-64 flex-1 text-center"></li>
          </ul>
        </dt>
        {renderedItems}
      </dl>
    </div>
  )
}

export default BitUsd
