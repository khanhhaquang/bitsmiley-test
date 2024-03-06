import React, { useState, useEffect, SetStateAction } from 'react'
import { Image } from '@/components/Image'
import { Header } from '@/components/Header'
import { TitleBox } from '@/components/Title'
import './index.scss'
import { formatEther, parseEther } from 'viem'
import { getOpenUrl, openUrl } from '@/utils/getAssetsUrl'
import { useNavigate, useParams } from 'react-router-dom'
import { bitSmileyABI, bitUSDABI } from '@/abi/abi'
import { SCANTXHASH } from '@/config/links'
import { formatDecimal, formatMoney } from '@/utils/formatter'
import LoadingAnimation from '@/components/LoadingAnimation'
import { displayAddress } from '@/utils/formatter'

import useContractAddresses from '@/hooks/useNetworkAddresses'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useUserInfo } from '@/hooks/useUserInfo'
import useUserVaultManager from '@/hooks/useUserVaultManager'
import useGetOraclePrice from '@/hooks/useGetOraclePrice'
import useWBTCContract from '@/hooks/useWBTCContract'
import { useStoreActions } from '@/hooks/useStoreActions'
import useGetUservault from '@/hooks/useGetUservault'
import { Hash } from 'viem'
import { useMintingPairs } from '@/hooks/useMintingPairs'
import { cn } from '@/utils/cn'

interface overviewBoxObject {
  availableToMint?: number
  debtBitUSD?: number
  collateralRate?: number
  lockedCollateral?: number
  liquidationPrice?: number
  availableToWithdraw?: number
}

const OpenVault: React.FC = () => {
  const navigate = useNavigate()
  const params = useParams()
  const pairChainId = Number(params.chainId)
  const { mintingPair, isLoading } = useMintingPairs(pairChainId)

  const [inputValue, setInputValue] = useState(0)
  const [isLoding, setIsLodingValue] = useState(false)
  //1=>Start ; 2=>mint bitUSD; 3=>mint bitUSD ing;4=> Minting Completed;5=>Changes Failed
  const [isState, setIsStateValue] = useState(1)
  const [isApproveStatus, setIsApproveStatus] = useState(1)

  const [balanceWBTC, setBalanceWBTC] = useState('')
  const [isApprove, setIsApprove] = useState(false)
  const [oraclePrice, setOraclePriceOracle] = useState(0)
  const [AvailableBitUSD, setAvailableBitUSD] = useState(0)

  const [overviewDataInit, setOverviewDataInit] = useState({
    liquidationPrice: 0,
    collateralRate: 0,
    debtBitUSD: 0,
    lockedCollateral: 0,
    availableToWithdraw: 0,
    availableToMint: 0
  })
  const [overviewAfterDataInit, setOverviewAfterDataInit] = useState({
    liquidationPrice: 0,
    collateralRate: 0,
    debtBitUSD: 0,
    lockedCollateral: 0,
    availableToWithdraw: 0,
    availableToMint: 0
  })

  const contractAddresses = useContractAddresses()
  const { writeContractAsync } = useWriteContract()
  const { address } = useUserInfo()

  const { vaultManagerData } = useUserVaultManager(inputValue)
  const { vaultManagerDataInit, refetchVaultManagerData, collateralTypes } =
    useUserVaultManager(0)
  const [txnId, setTxnId] = useState<Hash>()
  const { status } = useWaitForTransactionReceipt({ hash: txnId })

  const { oraclePrice1, refetchOraclePrice1 } = useGetOraclePrice()
  const { isAllowance, gitBalanceWBTC, refetchBalanceWBTC } = useWBTCContract()
  const { removeTransaction, addTransaction } = useStoreActions()
  const { vault1, refetchVault1 } = useGetUservault()

  const isGlobalStatus = async () => {
    let flag = true
    if (!address) {
      flag = false
    }
    return flag
  }

  const initData = async () => {
    const overviewInit = await overviewData()
    console.log('====>---', overviewInit)
    setOverviewDataInit(
      overviewInit as SetStateAction<{
        liquidationPrice: number
        collateralRate: number
        debtBitUSD: number
        lockedCollateral: number
        availableToWithdraw: number
        availableToMint: number
      }>
    )
  }

  const getRealTimeOracle = async () => {
    refetchOraclePrice1()
    if (oraclePrice1 != undefined) {
      setOraclePriceOracle(Number(formatEther(BigInt(oraclePrice1))))
    }
  }

  useEffect(() => {
    if (!oraclePrice1) return
    const timer = setInterval(() => [getRealTimeOracle()], 3000)
    return () => {
      clearInterval(timer)
    }
  }, [oraclePrice1])

  useEffect(() => {
    console.log('vault1-------', vault1)
    if (vault1) {
      if (vault1 != '0x0000000000000000000000000000000000000000') {
        setIsStateValue(3)
        setIsApprove(true)
      }
    }
  }, [vault1])

  useEffect(() => {
    if (vaultManagerDataInit && vault1) {
      initData()
    }
  }, [vaultManagerDataInit, vault1])

  useEffect(() => {
    if (oraclePrice1 || isAllowance) {
      setBalanceWBTC(formatEther(BigInt(gitBalanceWBTC || '')))
      if (isAllowance !== undefined) {
        const allowanceNum = Number(formatEther(BigInt(isAllowance)))
        if (allowanceNum >= inputValue) {
          setIsApprove(true)
        } else {
          setIsApprove(false)
        }
      }
      if (oraclePrice1 !== undefined) {
        setOraclePriceOracle(Number(formatEther(BigInt(oraclePrice1))))
      }
    }
  }, [oraclePrice1, isAllowance])
  useEffect(() => {
    if (collateralTypes && oraclePrice) {
      getAvailableBitUSD()
    }
  }, [collateralTypes, oraclePrice])

  const getAvailableBitUSD = async () => {
    const collateral = collateralTypes
    console.log(collateral)
    if (collateral) {
      const safetyFactor = Number(collateral[1]) / 10 ** 9
      const rate = Number(collateral[2]) / 10 ** 27

      const collateralEvaluation =
        (inputValue * oraclePrice * safetyFactor) / rate
      console.log(collateralEvaluation)
      setAvailableBitUSD(collateralEvaluation)
    }
  }

  const blurSetupVault = async () => {
    if (isAllowance != undefined) {
      const allowanceNum = Number(formatEther(BigInt(isAllowance)))
      if (allowanceNum >= inputValue) {
        setIsApprove(true)
      } else {
        setIsApprove(false)
      }

      getAvailableBitUSD()
    }
  }

  const handApproveFun = async () => {
    const flag = await isGlobalStatus()
    if (!flag) {
      return
    }
    if (inputValue <= 0) return
    setIsApproveStatus(1)
    console.log('approve start--->', inputValue)
    console.log(parseEther(inputValue.toString()))
    if (contractAddresses?.WBTC != undefined) {
      const txnId = await writeContractAsync({
        abi: bitUSDABI,
        address: contractAddresses?.WBTC,
        functionName: 'approve',
        args: [contractAddresses?.BitSmiley, parseEther(inputValue.toString())]
      })
      console.log(txnId)
      setTxnId(txnId)
      addTransaction(txnId)
      if (status !== 'pending') {
        setIsLodingValue(false)
        setIsStateValue(1)
        setIsApprove(true)
      } else {
        setIsLodingValue(true)
      }
    }
  }
  useEffect(() => {
    let closeTimeout: NodeJS.Timeout
    if (status !== 'pending') {
      setIsLodingValue(false)
      if (isApproveStatus == 1) {
        setIsStateValue(1)
      } else if (isApproveStatus == 2) {
        refetchBalanceWBTC()
        setIsStateValue(2)
        refetchVault1()
        refetchVaultManagerData()
      } else if (isApproveStatus == 3) {
        refetchVault1()
        refetchVaultManagerData()
        setIsStateValue(4)
      } else {
        refetchVault1()
        refetchVaultManagerData()
        setIsStateValue(3)
      }
      // if (vault1 != '0x0000000000000000000000000000000000000000') {
      //   refetchVaultManagerData()
      //   setIsStateValue(3)
      // } else {
      //   refetchBalanceWBTC()
      //   setIsStateValue(2)
      // }

      setIsApprove(true)
      closeTimeout = setTimeout(() => {
        removeTransaction(txnId?.toString() || '')
      }, 5000)
    }
    ;() => {
      clearTimeout(closeTimeout)
    }
  }, [removeTransaction, status, txnId, vault1])

  const StartFun = async () => {
    const flag = await isGlobalStatus()
    if (!flag) {
      return
    }
    setIsApproveStatus(2)
    try {
      const collateral = parseEther(inputValue.toString())
      if (contractAddresses?.BitSmiley != undefined) {
        const txnId = await writeContractAsync({
          abi: bitSmileyABI,
          address: contractAddresses?.BitSmiley,
          functionName: 'openVaultAndMintFromBTC',
          args: [0, collateral]
        })
        if (txnId) {
          setTxnId(txnId)
          addTransaction(txnId)
          if (status !== 'pending') {
            setIsLodingValue(false)
            setIsApprove(true)
            // setVault1(vault)
            setIsStateValue(2)
          } else {
            setIsLodingValue(true)
          }
        }
      }
    } catch (err) {
      setIsStateValue(5)
      console.log(err)
    }
  }

  const overviewData = async () => {
    const result = vaultManagerDataInit
    if (
      result?.liquidationPrice !== undefined &&
      result?.collateralRate !== undefined &&
      result?.debtBitUSD !== undefined &&
      result?.lockedCollateral !== undefined &&
      result?.availableToWithdraw !== undefined &&
      result?.availableToMint !== undefined
    ) {
      const arr = {
        liquidationPrice: Number(formatEther(BigInt(result?.liquidationPrice))),
        // collateralRate: Number(formatEther(result.collateralRate.toString())),
        collateralRate: (Number(result?.collateralRate) / 1000) * 100,
        debtBitUSD: Number(formatEther(BigInt(result?.debtBitUSD))),
        lockedCollateral: Number(formatEther(BigInt(result?.lockedCollateral))),
        availableToWithdraw: Number(
          formatEther(BigInt(result?.availableToWithdraw))
        ),
        availableToMint: Number(formatEther(BigInt(result?.availableToMint)))
      }
      console.log(arr)
      return arr
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^\d*\.?\d*$/
    const newValue = event.target.value
    if (regex.test(newValue)) {
      setInputValue(Number(newValue))
    }
  }

  const handleInputBlurMint = async () => {
    console.log(inputValue)
    if (inputValue < 0) return
    if (inputValue > overviewDataInit.availableToMint) {
      setInputValue(Number(formatDecimal(overviewDataInit.availableToMint, 4)))
    }

    const result = vaultManagerData
    if (
      result?.liquidationPrice != undefined &&
      result?.collateralRate != undefined &&
      result?.debtBitUSD != undefined &&
      result?.lockedCollateral != undefined &&
      result?.availableToWithdraw != undefined &&
      result?.availableToMint != undefined
    ) {
      const arr = {
        liquidationPrice: Number(formatEther(BigInt(result?.liquidationPrice))),
        // collateralRate: Number(formatEther(result.collateralRate.toString())),
        collateralRate: (Number(result?.collateralRate) / 1000) * 100,
        debtBitUSD: Number(formatEther(BigInt(result?.debtBitUSD))),
        lockedCollateral: Number(formatEther(BigInt(result?.lockedCollateral))),
        availableToWithdraw: Number(
          formatEther(BigInt(result?.availableToWithdraw))
        ),
        availableToMint: Number(formatEther(BigInt(result?.availableToMint)))
      }
      // const overviewInit = await overviewData(inputValue)
      // console.log('====>---', overviewInit)
      setOverviewAfterDataInit(arr)
    }
  }

  const onClickMintBitUsd = async () => {
    const flag = await isGlobalStatus()
    if (!flag) {
      return
    }
    console.log(inputValue)
    setIsApproveStatus(3)
    if (inputValue <= 0) return
    try {
      const USDAmount = parseEther(inputValue.toString())
      console.log('vault1===', vault1, 'bitUSDAmount', USDAmount.toString())
      const parameter = [
        vault1,
        USDAmount,
        0
        // , //btc
        // { value: 0, gasPrice: gasPrice }
      ]
      // contractNetworkNew.BitSmiley,
      //     bitSmileyABI
      if (contractAddresses !== undefined) {
        const txnId = await writeContractAsync({
          abi: bitSmileyABI,
          address: contractAddresses?.BitSmiley,
          functionName: 'mintFromBTC',
          args: parameter
        })
        if (txnId) {
          setTxnId(txnId)
          addTransaction(txnId)
          if (status !== 'pending') {
            setIsLodingValue(false)
            setIsStateValue(4)
          } else {
            setIsLodingValue(true)
          }
        }
      }
    } catch (err) {
      console.log(err)
    }
  }
  const handClickFild = () => {
    setIsStateValue(1)
  }
  const okClick = () => {
    navigate('/bit-usd')
  }

  // if (isNetworkError) return <NetworkErrorPage />
  if (isLoading) return <div>loading...</div>
  if (!mintingPair) return null

  console.log(mintingPair)
  return (
    <div>
      <Header wallet />
      <div>
        <div className=" mx-auto mt-[164px] max-w-[1434px]">
          <TitleBox
            message={
              isState == 1 || isState == 5
                ? 'Open a wBTC1 Vault'
                : isState == 2
                  ? 'wBTC1 Vault'
                  : `wBTC1 Vault: ${displayAddress(vault1)}`
            }
            isWhite={true}
          />
        </div>
        <div className=" container mx-auto">
          <dl className="mx-auto mt-[9px] max-w-[1530px] ">
            <dt className="mb-[16px]">
              <NetworkInfo list={mintingPair} />
            </dt>
          </dl>
          <div className={cn('line_bottom mb-[31px]')}></div>

          <div className="flex justify-center pb-[250px]">
            <div
              className={cn(
                'grid_bg relative mr-[99px] h-[528px] w-[629px] flex-none'
              )}>
              <div className={cn('blendMode t-0 l-0 absolute')}></div>
              <div className="relative h-[528px]">
                <CornerPin></CornerPin>
                <TitleBlock titleValue="Overview"></TitleBlock>
                {isState == 3 || isState == 4 ? (
                  <MintBitUsdOverviewBox
                    listData={overviewDataInit}
                    afterDataInit={overviewAfterDataInit}
                  />
                ) : (
                  <OverviewBox />
                )}
              </div>
            </div>
            <div className={cn('grid_bg relative flex-none')}>
              <div className={cn('blendMode_blue t-0 l-0 absolute')}></div>
              <div className="relative h-[528px] w-[629px] px-[53px] ">
                <CornerPin></CornerPin>
                {isState == 5 ? (
                  <FailedTitleBlock />
                ) : (
                  <TitleBlock
                    titleValue={`${
                      isState == 3
                        ? 'Mint bitUSd'
                        : isState == 4
                          ? 'Minting Completed'
                          : 'Setup Vault'
                    }`}></TitleBlock>
                )}

                <div>
                  {isLoding ? (
                    <LoadingBox
                      openUrlClick={() => openUrl(`${SCANTXHASH.test}${txnId}`)}
                    />
                  ) : isState == 1 ? (
                    <SetupVault
                      balance={balanceWBTC}
                      AvailableBitUSD={AvailableBitUSD}
                      price={oraclePrice}
                      inputValue={inputValue}
                      isApprove={isApprove}
                      handleBlur={blurSetupVault}
                      handleInputChange={handleInputChange}
                      handApproveFun={handApproveFun}
                      handStartFun={StartFun}
                    />
                  ) : isState == 2 ? (
                    <MintBitUSDBox
                      isOk={false}
                      toastMsg="ly created a vault. You can find it in “My Vault”. Continue to mint bitUSD from this vault"
                      handleClick={() => {
                        setIsStateValue(3)
                      }}
                      handleOkClick={() => {}}
                    />
                  ) : isState == 3 ? (
                    <MintBitUSDIng
                      afterDataInit={overviewAfterDataInit}
                      listData={overviewDataInit}
                      inputValue={inputValue}
                      handOnClickMint={onClickMintBitUsd}
                      handleBlur={handleInputBlurMint}
                      handleInputChange={handleInputChange}
                    />
                  ) : isState == 4 ? (
                    <MintBitUSDBox
                      isOk={true}
                      handleClick={() => {}}
                      toastMsg="Your vault change is completed. "
                      handleOkClick={okClick}
                    />
                  ) : isState == 5 ? (
                    <MintBitUSDBox
                      isOk={true}
                      handleClick={() => {}}
                      handleOkClick={handClickFild}
                      toastMsg="Your vault change has encountered an error ⓘ. Please try again"
                    />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <CopyRightAndLinks /> */}
    </div>
  )
}

const NetworkInfo: React.FC<{
  list: object
}> = ({ list }) => {
  console.log(list)
  const items = [
    {
      name: 'Borrow rate',
      value: `${list.borrowRate * 100} %`
    },
    {
      name: 'Liquidation Penalty',
      value: `${list.liquidity * 100} %`
    },
    {
      name: 'Vault Floor',
      value: `6k bitUSD `
    },
    {
      name: 'Vault Ceiling',
      value: `300k bitUSD`
    },
    // {
    //   name: 'Min Size',
    //   value: `${list.minSize * 100} BTC`
    // },
    {
      name: 'Max LTV',
      value: `${list.maxLTV * 100} %`
    }
  ]
  const renderedItems = items.map((item, index) => (
    <li key={index} className="mr-[40px] text-center">
      {item.name}: {item.value} ⓘ
    </li>
  ))
  return (
    <>
      <ul className="flex justify-center font-ibmr text-white">
        {renderedItems}
      </ul>
    </>
  )
}

const TitleBlock: React.FC<{
  titleValue: string
}> = ({ titleValue }) => {
  return (
    <>
      <h3 className="flex h-[46px] items-center justify-center text-center font-ppnb text-[36px] text-white">
        <span className="bg-black px-[24px]">{titleValue}</span>
      </h3>
    </>
  )
}

const CornerPin: React.FC = () => {
  return (
    <>
      <div className="union01 absolute left-0 top-[22px] h-[24px] w-[24px]"></div>
      <div className="union01 absolute right-0 top-[22px] h-[24px] w-[24px] rotate-90"></div>
      <div className="union01 absolute bottom-0 left-0 h-[24px] w-[24px] -rotate-90"></div>
      <div className="union01 absolute bottom-0 right-0 h-[24px] w-[24px] -rotate-180"></div>
    </>
  )
}

const SetupVault: React.FC<{
  inputValue: number
  balance: number | string
  isApprove: boolean
  price: number
  AvailableBitUSD: number | string
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handStartFun: () => void
  handApproveFun: () => void
  handleBlur: () => void
}> = ({
  inputValue,
  balance,
  handleBlur,
  AvailableBitUSD,
  price,
  isApprove = false,
  handleInputChange,
  handStartFun,
  handApproveFun
}) => {
  return (
    <>
      <div className="mb-[27px] mt-[84px] flex items-center justify-between font-ibmr text-[16px] text-white">
        <span>Deposit BTC</span>
        <span>{Number(balance)} available</span>
      </div>
      <div className="mb-[27px] bg-black/[.35] px-[20px] py-[10px]">
        <input
          type="number"
          min="1"
          className="input_style flex h-[47px] w-auto items-center font-ibmb
        text-[36px] leading-[47px] hover:border-none"
          onBlur={handleBlur}
          value={inputValue}
          onChange={handleInputChange}
        />
        <p className="mt-3 font-ibmr text-[16px] text-white/[.8]">
          ~
          {formatMoney(
            formatDecimal((price as number) * (inputValue as number), 4)
          )}{' '}
          USD
        </p>
      </div>

      <ul>
        {/* <li className="flex justify-between items-center font-ibmr text-white text-[16px] mb-[8px] h-[21px]">
          <span>Collateral locked</span>
          <p className="flex justify-between items-center font-ibmb">
            <span>0.00 BTC </span>
            <Image src={getOpenUrl('return')} className="w-[5px] mr-[9px] ml-2"/> 
            <span className="text-green"> 1.00 BTC</span></p>
        </li> */}
        <li className="mb-[8px] flex h-[21px] items-center justify-between font-ibmr text-[16px] text-white">
          <span>Available to generate bitUSD</span>
          <p className="flex items-center justify-between font-ibmb">
            <span>
              {formatMoney(formatDecimal(AvailableBitUSD || 0, 4))} ${' '}
            </span>
            {/* <Image src={getOpenUrl('return')} className="w-[5px] mr-[9px] ml-2"/> 
            <span className="text-green"> 1.00 BTC</span> */}
          </p>
        </li>
        {/* <li className="flex justify-between items-center font-ibmr text-white text-[16px] mb-[8px] h-[21px]">
          <span>Gas fee</span>
          <p className="flex justify-between items-center font-ibmb">
            <span className="text-green"> ~xxxx</span></p>
        </li> */}
      </ul>

      {/* <div className="flex justify-center mt-[28px]"> */}
      <div className="mt-[78px] flex justify-center">
        {!isApprove ? (
          <button
            className="relative flex h-[77px] w-[517px] items-center justify-center border-y-[3px]
          border-solid border-white bg-blue"
            onClick={handApproveFun}>
            <div className="button_bg absolute -left-[6px] -top-[3px]"></div>
            <div className="button_bg absolute -right-[6px] -top-[3px] rotate-180"></div>
            <span className="ml-[21px] font-ppnb text-[48px] text-white">
              Give permission to use BTC
            </span>
            <Image
              src={getOpenUrl('Union02')}
              className="ml-2 mr-[21px] w-[22px]"
            />
          </button>
        ) : (
          <button
            className="relative flex h-[77px] w-[517px] items-center justify-between border-y-[3px]
          border-solid border-white bg-blue"
            onClick={handStartFun}>
            <div className="button_bg absolute -left-[6px] -top-[3px]"></div>
            <div className="button_bg absolute -right-[6px] -top-[3px] rotate-180"></div>
            <span className="ml-[21px] font-ppnb text-[48px] text-white">
              Start
            </span>
            <Image
              src={getOpenUrl('union01')}
              className="ml-2 mr-[14px] w-[79px]"
            />
          </button>
        )}
      </div>
    </>
  )
}

const MintBitUSDIng: React.FC<{
  inputValue: number
  listData: overviewBoxObject
  afterDataInit: overviewBoxObject
  handleBlur: () => void
  handOnClickMint: () => void
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}> = ({
  inputValue,
  handleInputChange,
  handOnClickMint,
  afterDataInit,
  listData,
  handleBlur
}) => {
  return (
    <>
      <div className="mb-[27px] mt-[44px] flex items-center justify-between font-ibmr text-[16px] text-white">
        <span>Mint bitUSD</span>
        <span>
          Max: {formatMoney(formatDecimal(listData.availableToMint, 4))} $
        </span>
      </div>
      <div className="relative mb-[27px] bg-black/[.35] px-[20px] py-[10px]">
        <input
          type="number"
          min="1"
          className="input_style flex h-[47px] w-auto items-center font-ibmb
        text-[36px] leading-[47px] hover:border-none"
          placeholder="1"
          onBlur={handleBlur}
          value={inputValue}
          onChange={handleInputChange}
        />
        <p className="absolute -top-[17px] right-[20px] mt-3 font-ppnb text-[48px] text-blue/[.5]">
          bitUSD
        </p>
      </div>

      <ul>
        <li className="mb-[8px] flex h-[21px] items-center justify-between font-ibmr text-[16px] text-white">
          <span className="whitespace-nowrap">Vault Debt</span>
          <p className="flex items-center justify-between font-ibmb">
            <span>{formatMoney(formatDecimal(listData.debtBitUSD, 4))} $ </span>
            <Image
              src={getOpenUrl('return')}
              className="ml-2 mr-[9px] w-[5px]"
            />
            <span className="text-green">
              {' '}
              {formatMoney(formatDecimal(afterDataInit.debtBitUSD, 4))} $
            </span>
          </p>
        </li>
        <li className="mb-[8px] flex h-[21px] items-center justify-between font-ibmr text-[16px] text-white">
          <span className="whitespace-nowrap">Health factor</span>
          <p className="flex items-center justify-between font-ibmb">
            <span>{formatDecimal(listData.collateralRate, 2)} % </span>
            <Image
              src={getOpenUrl('return')}
              className="ml-2 mr-[9px] w-[5px]"
            />
            <span className="text-green">
              {' '}
              {formatDecimal(afterDataInit.collateralRate, 2)} %
            </span>
          </p>
        </li>
        <li className="mb-[8px] flex h-[21px] items-center justify-between font-ibmr text-[16px] text-white">
          <span className="whitespace-nowrap">Available to mint bitUSD</span>
          <p className="flex items-center justify-between whitespace-nowrap font-ibmb">
            <span>
              {formatMoney(formatDecimal(listData.availableToMint, 4))} ${' '}
            </span>
            <Image
              src={getOpenUrl('return')}
              className="ml-2 mr-[9px] w-[5px]"
            />
            <span className="text-green">
              {' '}
              {formatMoney(formatDecimal(afterDataInit.availableToMint, 4))} $
            </span>
          </p>
        </li>
        <li className="mb-[8px] flex h-[21px] items-center justify-between font-ibmr text-[16px] text-white">
          <span className="whitespace-nowrap">Liquidation Price</span>
          <p className="flex items-center justify-between font-ibmb">
            <span>
              {formatMoney(formatDecimal(listData.liquidationPrice, 4))} ${' '}
            </span>
            <Image
              src={getOpenUrl('return')}
              className="ml-2 mr-[9px] w-[5px]"
            />
            <span className="text-green">
              {' '}
              {formatMoney(formatDecimal(afterDataInit.liquidationPrice, 4))} $
            </span>
          </p>
        </li>
      </ul>

      <div className="absolute bottom-[34px] mt-[28px] flex justify-center">
        <button
          className="relative flex h-[77px] w-[517px] items-center justify-between border-y-[3px]
        border-solid border-white bg-blue"
          onClick={handOnClickMint}>
          <div className="button_bg absolute -left-[6px] -top-[3px]"></div>
          <div className="button_bg absolute -right-[6px] -top-[3px] rotate-180"></div>
          <span className="ml-[21px] font-ppnb text-[48px] text-white">
            Start
          </span>
          <Image
            src={getOpenUrl('union01')}
            className="ml-2 mr-[14px] w-[79px]"
          />
        </button>
      </div>
    </>
  )
}

const LoadingBox: React.FC<{
  openUrlClick: () => void
}> = ({ openUrlClick }) => {
  return (
    <>
      <div>
        <p className="m-auto my-[163px] max-w-[381px] text-center leading-[20px]">
          <span className=" font-ibmr text-white" onClick={openUrlClick}>
            Your transaction is getting processed on-chain{' '}
            <span className="text-green">[Check here]</span>
          </span>
        </p>
        <div className="absolute bottom-[34px] mt-[28px] flex justify-center">
          <button
            className="relative flex h-[77px] w-[517px] items-center justify-center border-y-[3px]
          border-solid border-white/[.5] bg-white/[.2]">
            <div className="button_bg2 absolute -left-[6px] -top-[3px]"></div>
            <div className="button_bg2 absolute -right-[6px] -top-[3px] rotate-180"></div>
            <span className="ml-[21px] font-ppnb text-[48px] text-white/[.5]">
              <LoadingAnimation text="Processing"></LoadingAnimation>
            </span>
          </button>
        </div>
      </div>
    </>
  )
}

const MintBitUSDBox: React.FC<{
  toastMsg: string
  isOk: boolean
  handleClick: () => void
  handleOkClick: () => void
}> = ({ toastMsg, isOk = false, handleClick, handleOkClick }) => {
  return (
    <>
      <div>
        <p className="m-auto my-[163px] max-w-[381px] text-center font-ibmr leading-[20px] text-white">
          {toastMsg}
        </p>
        <div className="absolute bottom-[34px] mt-[28px] flex justify-center">
          {isOk ? (
            <button
              className="relative flex h-[77px] w-[517px] items-center justify-center border-y-[3px]
            border-solid border-white bg-blue"
              onClick={handleOkClick}>
              <div className="button_bg absolute -left-[6px] -top-[3px]"></div>
              <div className="button_bg absolute -right-[6px] -top-[3px] rotate-180"></div>
              <span className="ml-[21px] font-ppnb text-[48px] text-white">
                Ok
              </span>
            </button>
          ) : (
            <button
              className="relative flex h-[77px] w-[517px] items-center justify-between border-y-[3px]
            border-solid border-white bg-blue"
              onClick={handleClick}>
              <div className="button_bg absolute -left-[6px] -top-[3px]"></div>
              <div className="button_bg absolute -right-[6px] -top-[3px] rotate-180"></div>
              <span className="ml-[21px] font-ppnb text-[48px] text-white">
                Mint bitUSD
              </span>
              <Image
                src={getOpenUrl('union01')}
                className="mr-[14px] w-[79px]"
              />
            </button>
          )}
        </div>
      </div>
    </>
  )
}

const OverviewBox: React.FC = () => {
  return (
    <>
      <div className="mt-[94px] flex items-center justify-center">
        <Image src={getOpenUrl('Untitled')} className="mr-[44px] w-[251px]" />
        {/* <div className={`text-white ${isOpacity?'opacity-50':''}`}>
        <div>
          <p className="text-base font-ibmr">Collateral locked</p>
          <h1 className="text-[72px] leading-[51px] font-ppnb mt-1 mb-3">$0.00</h1>
          <div className="relative font-ibmb bg-white w-[144px] h-[29px] text-black pl-[8px] flex items-center"> 
            <div className="button_white absolute -left-[4px] top-0 w-[4px] h-[29px]"></div>
            <div className="button_white rotate-180 absolute -right-[4px] top-0 w-[4px] h-[29px]"></div>
            40,000 After 
          </div>
        </div>
        <div className="mt-[34px]">
          <p className="text-base font-ibmr">Available to generate</p>
          <h1 className="text-[72px] leading-[51px] font-ppnb mt-1 mb-3">$0.00</h1>
          <div className="relative font-ibmb bg-white w-[144px] h-[29px] text-black pl-[8px] flex items-center"> 
            <div className="button_white absolute -left-[4px] top-0 w-[4px] h-[29px]"></div>
            <div className="button_white rotate-180 absolute -right-[4px] top-0 w-[4px] h-[29px]"></div>
            40,000 After 
          </div>
        </div>
      </div> */}
      </div>
    </>
  )
}

const MintBitUsdOverviewBox: React.FC<{
  listData: overviewBoxObject
  afterDataInit: overviewBoxObject
}> = ({ listData, afterDataInit }) => {
  return (
    <>
      <div className="mt-[10px]  px-[30px]">
        <div
          className={`flex flex-wrap items-center justify-between px-[30px] text-white`}>
          <div className="mt-[24px] w-[50%]">
            <p className="font-ibmr text-base">Liquidation Price</p>
            <h1 className="mb-4 mt-1 font-ppnb text-[72px] leading-[51px]">
              $
              {listData?.liquidationPrice == 0
                ? ' -'
                : formatMoney(formatDecimal(listData.liquidationPrice || 0, 2))}
            </h1>
            <div className="relative flex h-[31px] w-[196px] items-center bg-black pl-[8px] font-ibmr text-white">
              ${' '}
              {formatMoney(
                formatDecimal(afterDataInit.liquidationPrice || 0, 2)
              )}{' '}
              after ⓘ{/* $ {afterDataInit.liquidationPrice} after ⓘ  */}
            </div>
          </div>
          <div className="mt-[24px] w-[50%] pl-[10px]">
            <p className="font-ibmr text-base">Health factor</p>
            <h1 className="mb-4 mt-1 font-ppnb text-[72px] leading-[51px]">
              {formatDecimal(listData.collateralRate || 0, 2)}%
            </h1>
            <div className="relative flex h-[31px] w-[196px] items-center bg-black pl-[8px] font-ibmr text-white">
              % {formatDecimal(afterDataInit.collateralRate || 0, 2)} after ⓘ
            </div>
          </div>
          <div className="mt-[24px] w-[50%]">
            <p className="font-ibmr text-base">Vault Debt</p>
            <h1 className="mb-4 mt-1 font-ppnb text-[72px] leading-[51px]">
              ${formatMoney(formatDecimal(listData.debtBitUSD || 0, 4))}
            </h1>
            <div className="relative flex h-[31px] w-[196px] items-center bg-black pl-[8px] font-ibmr text-white">
              $ {formatMoney(formatDecimal(afterDataInit.debtBitUSD || 0, 4))}{' '}
              after ⓘ
            </div>
          </div>
        </div>

        <div
          className={`mt-[20px] flex items-start justify-center text-white/[.7]`}>
          <div className="mt-[24px]">
            <p className="whitespace-nowrap font-ibmr text-[14px]">
              Collateral locked
            </p>
            <h1 className="mb-[6px] whitespace-nowrap font-ppnb text-[32px] leading-[32px]">
              {' '}
              {formatMoney(
                formatDecimal(listData.lockedCollateral || 0, 4)
              )}{' '}
              BTC
            </h1>
            <div className="relative flex h-[31px] min-w-[100px] items-center bg-black pl-[8px] font-ibmr text-[14px] text-white">
              {formatMoney(
                formatDecimal(afterDataInit.lockedCollateral || 0, 4)
              )}{' '}
              after
            </div>
          </div>
          <div className="mt-[24px] pl-[18px] pr-[18px]">
            <p className="whitespace-nowrap font-ibmr text-[14px]">
              Available to withdraw
            </p>
            <h1 className="mb-[6px] whitespace-nowrap font-ppnb text-[32px] leading-[32px]">
              {' '}
              {formatMoney(
                formatDecimal(listData.availableToWithdraw || 0, 4)
              )}{' '}
              BTC
            </h1>
            <div className="relative flex h-[31px] min-w-[100px] items-center bg-black pl-[8px] font-ibmr text-[14px] text-white">
              {formatMoney(
                formatDecimal(afterDataInit.availableToWithdraw || 0, 4)
              )}{' '}
              after
            </div>
          </div>
          <div className="mt-[24px]">
            <p className="whitespace-nowrap font-ibmr text-[14px] ">
              Available to mint
            </p>
            <h1 className="mb-[6px] whitespace-nowrap font-ppnb text-[32px] leading-[32px]">
              {' '}
              {formatMoney(
                formatDecimal(listData.availableToMint || 0, 4)
              )}{' '}
              bitUSD
            </h1>
            <div className="relative flex h-[31px] min-w-[100px] items-center bg-black pl-[8px] font-ibmr text-[14px] text-white">
              {formatMoney(
                formatDecimal(afterDataInit.availableToMint || 0, 4)
              )}{' '}
              after
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const FailedTitleBlock: React.FC = () => {
  return (
    <>
      <h3 className="flex h-[46px] items-center justify-center text-center font-ppnb text-[36px] text-[#FF0000]">
        <span className=" bg-black px-[24px]">Changes Failed</span>
      </h3>
    </>
  )
}

export default OpenVault
