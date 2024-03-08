import React, { useState, useEffect, SetStateAction } from 'react'
import { Image } from '@/components/Image'
import { TitleBox } from '@/components/Title'
import './index.scss'
import { formatEther, parseEther } from 'viem'
import { getOpenUrl, openUrl } from '@/utils/getAssetsUrl'
import { useNavigate, useParams } from 'react-router-dom'
import { bitSmileyABI, bitUSDABI } from '@/abi/abi'
import { SCANTXHASH } from '@/config/links'
import {
  formatDecimal,
  formatMoney,
  processInput,
  formatAmountThousands
} from '@/utils/formatter'
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
import { OverviewBox } from '@/components/OverviewBox'
import { VaultTitleBar } from '@/components/VaultTitleBar'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'

interface overviewBoxObject {
  availableToMint?: number
  debtBitUSD?: number
  healthFactor?: number
  lockedCollateral?: number
  liquidationPrice?: number
  availableToWithdraw?: number
}

// interface VaultsStateBar {
//   borrowRate?: number
//   chainId?: number
//   collateralLocked?: number
//   collateralRatio?: number
//   isOpenVault?: boolean
//   liquidity?: number
//   maxLTV?: number
//   minSize?: number
//   network?: number
//   totalDebt?: number
// }

const OpenVault: React.FC = () => {
  const navigate = useNavigate()
  const params = useParams()
  const pairChainId = Number(params.chainId)
  const { mintingPair, isLoading } = useMintingPairs(pairChainId)

  const [userInputValue, setUserInputValue] = useState('0')
  const [inputValue, setInputValue] = useState('')
  const [isLoding, setIsLodingValue] = useState(false)
  const [disableButton, setDisableButton] = useState(false)
  //1=>Start ; 2=>mint bitUSD; 3=>mint bitUSD ing;4=> Minting Completed;5=>Changes Failed
  const [isState, setIsStateValue] = useState(1)
  const [isApproveStatus, setIsApproveStatus] = useState(1)

  const [balanceWBTC, setBalanceWBTC] = useState('')
  const [isApprove, setIsApprove] = useState(false)
  const [oraclePrice, setOraclePriceOracle] = useState(0)
  const [AvailableBitUSD, setAvailableBitUSD] = useState(0)

  const [overviewDataInit, setOverviewDataInit] = useState({
    liquidationPrice: 0,
    healthFactor: 0,
    debtBitUSD: 0,
    lockedCollateral: 0,
    availableToWithdraw: 0,
    availableToMint: 0
  })
  const [overviewAfterDataInit, setOverviewAfterDataInit] = useState({
    liquidationPrice: 0,
    healthFactor: 0,
    debtBitUSD: 0,
    lockedCollateral: 0,
    availableToWithdraw: 0,
    availableToMint: 0
  })

  const contractAddresses = useContractAddresses()
  const { writeContractAsync } = useWriteContract()
  const { address, isConnected } = useUserInfo()

  const { vaultManagerData } = useUserVaultManager(userInputValue)
  const { vaultManagerDataInit, refetchVaultManagerData, collateralTypes } =
    useUserVaultManager('0')
  const [txnId, setTxnId] = useState<Hash>()
  const { status } = useWaitForTransactionReceipt({ hash: txnId })

  const { oraclePrice1, refetchOraclePrice1 } = useGetOraclePrice()
  const {
    isAllowance,
    gitBalanceWBTC,
    refetchisAllowance,
    refetchBalanceWBTC
  } = useWBTCContract()
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
        healthFactor: number
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
        if (allowanceNum >= Number(inputValue)) {
          setIsApprove(true)
        } else {
          setIsApprove(false)
        }
      }
      if (oraclePrice1 !== undefined) {
        setOraclePriceOracle(Number(formatEther(BigInt(oraclePrice1))))
      }
    }
  }, [oraclePrice1, isAllowance, gitBalanceWBTC])
  useEffect(() => {
    if (collateralTypes && oraclePrice > 0) {
      getAvailableBitUSD(inputValue)
    }
  }, [collateralTypes, oraclePrice])

  const getAvailableBitUSD = async (amount: string) => {
    const collateral = collateralTypes
    console.log(collateral)
    if (collateral) {
      const safetyFactor = Number(collateral[1]) / 10 ** 9
      const rate = Number(collateral[2]) / 10 ** 27
      const collateralEvaluation =
        (Number(amount) * oraclePrice * safetyFactor) / rate
      console.log(collateralEvaluation)
      setAvailableBitUSD(collateralEvaluation)
    }
  }

  const blurSetupVault = async (amount: string) => {
    if (isAllowance != undefined) {
      const allowanceNum = Number(formatEther(BigInt(isAllowance)))
      console.log(allowanceNum, isAllowance)
      if (allowanceNum >= Number(amount)) {
        setIsApprove(true)
      } else {
        setIsApprove(false)
      }

      getAvailableBitUSD(amount)
    }
  }

  const handApproveFun = async () => {
    const flag = await isGlobalStatus()
    if (!flag) {
      return
    }
    if (Number(inputValue) <= 0) {
      return
    }
    setDisableButton(true)
    setIsApproveStatus(1)
    console.log('approve start--->', inputValue)
    console.log(parseEther(inputValue))
    try {
      if (contractAddresses?.WBTC != undefined) {
        const txnId = await writeContractAsync({
          abi: bitUSDABI,
          address: contractAddresses?.WBTC,
          functionName: 'approve',
          args: [
            contractAddresses?.BitSmiley,
            parseEther(inputValue.toString())
          ]
        })
        console.log(txnId)
        setTxnId(txnId)
        addTransaction(txnId)
        setIsLodingValue(true)
        // if (status !== 'pending') {
        //   setIsLodingValue(false)
        //   setIsStateValue(1)
        //   setIsApprove(true)
        // } else {
        //   setIsLodingValue(true)
        // }
      }
    } catch (err) {
      setDisableButton(false)
    }
  }
  useEffect(() => {
    let closeTimeout: NodeJS.Timeout
    if (status !== 'pending') {
      setDisableButton(false)
      setIsLodingValue(false)
      setUserInputValue('0')
      if (isApproveStatus == 1) {
        setIsStateValue(1)
        refetchisAllowance()
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
    if (Number(inputValue) <= 0) return
    setDisableButton(true)
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
          setIsLodingValue(true)
          // if (status !== 'pending') {
          //   setIsLodingValue(false)
          //   setIsApprove(true)
          //   // setVault1(vault)
          //   setIsStateValue(2)
          // } else {
          //   setIsLodingValue(true)
          // }
        }
      }
    } catch (err) {
      setIsStateValue(5)
      setIsLodingValue(false)
      setDisableButton(false)
      console.log(err)
    }
  }

  const overviewData = async () => {
    const result = vaultManagerDataInit
    if (
      result?.liquidationPrice !== undefined &&
      result?.healthFactor !== undefined &&
      result?.debtBitUSD !== undefined &&
      result?.lockedCollateral !== undefined &&
      result?.availableToWithdraw !== undefined &&
      result?.availableToMint !== undefined
    ) {
      const arr = {
        liquidationPrice: Number(formatEther(BigInt(result?.liquidationPrice))),
        // healthFactor: Number(formatEther(result.healthFactor.toString())),
        healthFactor: (Number(result?.healthFactor) / 1000) * 100,
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
    const formatNum = processInput(event.target.value)
    console.log(event.target.value, formatNum)
    setInputValue(formatNum)
    setUserInputValue(formatNum)
    if (isState == 1) {
      if (Number(formatNum) > Number(balanceWBTC)) {
        setInputValue(formatDecimal(balanceWBTC, 4) || '0')
        setUserInputValue(formatDecimal(balanceWBTC, 4) || '0')
      }
      refetchisAllowance()
      blurSetupVault(formatNum)
    } else {
      if (Number(formatNum) > overviewDataInit.availableToMint) {
        setInputValue(formatDecimal(overviewDataInit.availableToMint, 4) || '0')
        setUserInputValue(
          formatDecimal(overviewDataInit.availableToMint, 4) || '0'
        )
      }
    }
  }
  const getAfterData = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = vaultManagerData
    const arr = {
      liquidationPrice: Number(
        formatEther(result.liquidationPrice.toString() || '')
      ),
      healthFactor: (Number(result.healthFactor) / 1000) * 100,
      debtBitUSD: Number(formatEther(result.debtBitUSD || '')),
      lockedCollateral: Number(
        formatEther(result.lockedCollateral.toString() || '')
      ),
      availableToWithdraw: Number(
        formatEther(result.availableToWithdraw.toString())
      ).toFixed(4),
      availableToMint: Number(
        formatEther(result.availableToMint.toString() || '')
      )
    }
    if (userInputValue != '0') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setOverviewAfterDataInit(arr as any)
    } else {
      setOverviewAfterDataInit({
        liquidationPrice: 0,
        healthFactor: 0,
        debtBitUSD: 0,
        lockedCollateral: 0,
        availableToWithdraw: 0,
        availableToMint: 0
      })
    }
  }
  useEffect(() => {
    if (vaultManagerData) {
      console.log(vaultManagerData)
      getAfterData()
    }
  }, [vaultManagerData])

  const onClickMintBitUsd = async () => {
    const flag = await isGlobalStatus()
    if (!flag) {
      return
    }
    console.log(inputValue)
    if (Number(inputValue) <= 0) return
    setDisableButton(true)
    setIsApproveStatus(3)
    try {
      const USDAmount = parseEther(inputValue.toString())
      console.log('vault1===', vault1, 'bitUSDAmount', USDAmount.toString())
      const parameter = [vault1, USDAmount, 0]
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
          setIsLodingValue(true)
          // if (status !== 'pending') {
          //   setIsLodingValue(false)
          //   setIsStateValue(4)
          // } else {
          //   setIsLodingValue(true)
          // }
        }
      }
    } catch (err) {
      console.log(err)
      setIsLodingValue(false)
      setDisableButton(false)
      setIsStateValue(5)
    }
  }
  const handClickFild = () => {
    if (isApproveStatus == 1) {
      setIsStateValue(1)
    } else if (isApproveStatus == 2) {
      setIsStateValue(1)
    } else if (isApproveStatus == 3) {
      setIsStateValue(3)
    } else {
      setIsStateValue(3)
    }
  }
  const okClick = () => {
    navigate('/bit-usd')
  }

  // if (isNetworkError) return <NetworkErrorPage />
  if (isLoading) return <Loading />
  if (!isConnected) return <NotConnected />
  if (!mintingPair) return null

  console.log(mintingPair)
  return (
    <div>
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
              <VaultTitleBar list={mintingPair} />
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
                  <OverviewBox
                    listData={overviewDataInit}
                    afterDataInit={overviewAfterDataInit}
                  />
                ) : (
                  <OverviewBoxImg />
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
                      disableButton={disableButton}
                      balance={balanceWBTC}
                      AvailableBitUSD={AvailableBitUSD}
                      price={oraclePrice}
                      inputValue={inputValue}
                      isApprove={isApprove}
                      handleBlur={() => blurSetupVault(inputValue)}
                      handleInputChange={handleInputChange}
                      handApproveFun={() => !disableButton && handApproveFun()}
                      handStartFun={() => !disableButton && StartFun()}
                    />
                  ) : isState == 2 ? (
                    <MintBitUSDBox
                      isOk={false}
                      toastMsg="You have successfully created a vault. You can find it in “My Vault”. Continue to mint bitUSD from this vault"
                      handleClick={() => {
                        setIsStateValue(3)
                        setInputValue('0')
                        setUserInputValue('0')
                      }}
                      handleOkClick={() => {}}
                    />
                  ) : isState == 3 ? (
                    <MintBitUSDIng
                      disableButton={disableButton}
                      afterDataInit={overviewAfterDataInit}
                      listData={overviewDataInit}
                      inputValue={inputValue}
                      handOnClickMint={() =>
                        !disableButton && onClickMintBitUsd()
                      }
                      handleBlur={() => {}}
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

const NotConnected: React.FC = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center border-white text-white">
      <div className="flex flex-col items-center justify-center gap-y-12 border border-white/50 bg-black bg-connect-modal bg-cover bg-no-repeat p-[42px]">
        <div className="font-ppnb text-5xl">Connect wallet first</div>
        <div className="max-w-[330px] text-center font-ibmr text-sm">
          To earn bitPoint, connect your wallet to conitnue.
        </div>
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
      <div
        className={cn(
          'union01 absolute left-0 top-[22px] h-[24px] w-[24px]'
        )}></div>
      <div
        className={cn(
          'union01 absolute right-0 top-[22px] h-[24px] w-[24px] rotate-90'
        )}></div>
      <div
        className={cn(
          'union01 absolute bottom-0 left-0 h-[24px] w-[24px] -rotate-90'
        )}></div>
      <div
        className={cn(
          'union01 absolute bottom-0 right-0 h-[24px] w-[24px] -rotate-180'
        )}></div>
    </>
  )
}

const SetupVault: React.FC<{
  disableButton: boolean
  inputValue: string
  balance: number | string
  isApprove: boolean
  price: number
  AvailableBitUSD: number | string
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handStartFun: () => void
  handApproveFun: () => void
  handleBlur: () => void
}> = ({
  disableButton,
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
        <span>Deposit wBTC</span>
        <span>{Number(balance)} available</span>
      </div>
      <div className="mb-[27px] bg-black/[.35] px-[20px] py-[10px]">
        <input
          type="number"
          placeholder="0"
          className={cn(
            'input_style flex h-[47px] w-auto items-center font-ibmb text-[36px] leading-[47px] hover:border-none'
          )}
          onBlur={handleBlur}
          value={inputValue}
          onChange={handleInputChange}
        />
        <p className="mt-3 font-ibmr text-[16px] text-white/[.8]">
          ~
          {formatMoney(
            formatDecimal((price as number) * Number(inputValue), 4)
          )}
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
            className={cn(
              `relative flex h-[77px] w-[517px] items-center justify-center border-y-[3px]
          border-solid border-white bg-blue `,
              disableButton && 'bg-[#5C5C5C] border-[#828282]'
            )}
            onClick={handApproveFun}>
            <div
              className={cn(
                'button_bg absolute -left-[6px] -top-[3px]',
                disableButton && 'button_bg_disable h-[77px]'
              )}></div>
            <div
              className={cn(
                'button_bg absolute -right-[6px] -top-[3px] rotate-180',
                disableButton && 'button_bg_disable h-[77px]'
              )}></div>
            <span
              className={cn(
                'ml-[21px] font-ppnb text-[36px] text-white cursor-pointer',
                disableButton && ' text-white/[.5]'
              )}>
              Give permission to use BTC
            </span>
            <Tooltip>
              <TooltipTrigger>
                <Image
                  src={getOpenUrl('Union02')}
                  className={cn(
                    'ml-2 mr-[21px] w-[22px]',
                    disableButton && ' opacity-50'
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>
                To continue, you need to allow bitSmiley smart contracts to use
                your wBTC. This has to be done only once for each token.
              </TooltipContent>
            </Tooltip>
          </button>
        ) : (
          <button
            className={cn(
              ' cursor-pointer relative flex h-[77px] w-[517px] items-center justify-between border-y-[3px] border-solid border-white bg-blue',
              disableButton && 'bg-[#5C5C5C] border-[#828282]'
            )}
            onClick={handStartFun}>
            <div
              className={cn(
                'button_bg absolute -left-[6px] -top-[3px]',
                disableButton && 'button_bg_disable h-[77px]'
              )}></div>
            <div
              className={cn(
                'button_bg absolute -right-[6px] -top-[3px] rotate-180',
                disableButton && 'button_bg_disable h-[77px]'
              )}></div>

            <span
              className={cn(
                'ml-[21px] font-ppnb text-[36px] text-white',
                disableButton && ' text-white/[.5]'
              )}>
              Start
            </span>
            <Image
              src={getOpenUrl('union01')}
              className={cn(
                'ml-2 mr-[14px] w-[79px]',
                disableButton && ' opacity-50'
              )}
            />
          </button>
        )}
      </div>
    </>
  )
}

const MintBitUSDIng: React.FC<{
  disableButton: boolean
  inputValue: string
  listData: overviewBoxObject
  afterDataInit: overviewBoxObject
  handleBlur: () => void
  handOnClickMint: () => void
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}> = ({
  disableButton,
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
      <div className="relative mb-[27px] bg-black/[.35] px-[20px] py-[10px] pr-[147px]">
        <input
          type="number"
          className={cn(
            'input_style flex h-[47px] w-[370px] items-center font-ibmb overflow-hidden text-[36px] leading-[47px] hover:border-none'
          )}
          placeholder="0"
          onBlur={handleBlur}
          value={inputValue}
          onChange={handleInputChange}
        />
        <p
          className={cn(
            'absolute -top-[17px] right-[20px] mt-3 font-ppnb text-[48px] text-blue/[.5]'
          )}>
          bitUSD
        </p>
      </div>

      <ul>
        <li className="mb-[8px] flex h-[21px] items-center justify-between font-ibmr text-[16px] text-white">
          <span className="whitespace-nowrap">Vault Debt</span>
          <p className="flex items-center justify-between font-ibmb">
            <span>{formatMoney(formatDecimal(listData.debtBitUSD, 2))} $ </span>
            <Image
              src={getOpenUrl('return')}
              className="ml-2 mr-[9px] w-[5px]"
            />
            <span className="text-green">
              {' '}
              {formatMoney(formatDecimal(afterDataInit.debtBitUSD, 2))} $
            </span>
          </p>
        </li>
        <li className="mb-[8px] flex h-[21px] items-center justify-between font-ibmr text-[16px] text-white">
          <span className="whitespace-nowrap">Health factor</span>
          <p className="flex items-center justify-between font-ibmb">
            <span>
              {formatDecimal((listData.healthFactor || 0).toString(), 1)} %{' '}
            </span>
            <Image
              src={getOpenUrl('return')}
              className="ml-2 mr-[9px] w-[5px]"
            />
            <span className="text-green">
              {' '}
              {formatDecimal((afterDataInit.healthFactor || 0).toString(), 1)} %
            </span>
          </p>
        </li>
        <li className="mb-[8px] flex h-[21px] items-center justify-between font-ibmr text-[16px] text-white">
          <span className="whitespace-nowrap">Available to mint bitUSD</span>
          <p className="flex items-center justify-between whitespace-nowrap font-ibmb">
            <span>
              {formatAmountThousands(
                (listData.availableToMint || 0).toString(),
                2
              )}{' '}
              ${' '}
            </span>
            <Image
              src={getOpenUrl('return')}
              className="ml-2 mr-[9px] w-[5px]"
            />
            <span className="text-green">
              {' '}
              {formatAmountThousands(
                (afterDataInit.availableToMint || 0).toString(),
                2
              )}{' '}
              $
            </span>
          </p>
        </li>
        <li className="mb-[8px] flex h-[21px] items-center justify-between font-ibmr text-[16px] text-white">
          <span className="whitespace-nowrap">Liquidation Price</span>
          <p className="flex items-center justify-between font-ibmb">
            <span>
              {listData.liquidationPrice == 0
                ? ' - '
                : formatAmountThousands(
                    (listData.liquidationPrice || 0).toString(),
                    2
                  )}{' '}
              $
            </span>
            <Image
              src={getOpenUrl('return')}
              className="ml-2 mr-[9px] w-[5px]"
            />
            <span className="text-green">
              {afterDataInit.liquidationPrice == 0
                ? ' - '
                : formatAmountThousands(
                    (afterDataInit.liquidationPrice || 0).toString(),
                    2
                  )}{' '}
              $
            </span>
          </p>
        </li>
      </ul>

      <div
        className={cn('absolute bottom-[34px] w-[517px] flex justify-center')}>
        <button
          className={cn(
            ' cursor-pointer relative flex h-[77px] w-[517px] items-center justify-between border-y-[3px] border-solid border-white bg-blue',
            disableButton && 'bg-[#5C5C5C] border-[#828282]'
          )}
          onClick={handOnClickMint}>
          <div
            className={cn(
              'button_bg absolute -left-[6px] -top-[3px]',
              disableButton && 'button_bg_disable h-[77px]'
            )}></div>
          <div
            className={cn(
              'button_bg absolute -right-[6px] -top-[3px] rotate-180',
              disableButton && 'button_bg_disable h-[77px]'
            )}></div>
          <span
            className={cn(
              'ml-[21px] font-ppnb text-[48px] text-white',
              disableButton && ' text-white/[.5]'
            )}>
            Start
          </span>
          <Image
            src={getOpenUrl('union01')}
            className={cn(
              'ml-2 mr-[14px] w-[79px]',
              disableButton && ' opacity-50'
            )}
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
              className={cn(
                'relative flex h-[77px] w-[517px] items-center justify-center border-y-[3px] border-solid border-white bg-blue cursor-pointer'
              )}
              onClick={handleOkClick}>
              <div
                className={cn(
                  'button_bg absolute -left-[6px] -top-[3px]'
                )}></div>
              <div
                className={cn(
                  'button_bg absolute -right-[6px] -top-[3px] rotate-180'
                )}></div>
              <span className="ml-[21px] font-ppnb text-[48px] text-white">
                Ok
              </span>
            </button>
          ) : (
            <button
              className="relative flex h-[77px] w-[517px] cursor-pointer items-center justify-between
            border-y-[3px] border-solid border-white  bg-blue"
              onClick={handleClick}>
              <div
                className={cn(
                  'button_bg absolute -left-[6px] -top-[3px]'
                )}></div>
              <div
                className={cn(
                  'button_bg absolute -right-[6px] -top-[3px] rotate-180'
                )}></div>
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

const OverviewBoxImg: React.FC = () => {
  return (
    <>
      <div className="mt-[94px] flex items-center justify-center">
        <Image src={getOpenUrl('Untitled')} className="mr-[44px] w-[251px]" />
      </div>
    </>
  )
}

const FailedTitleBlock: React.FC = () => {
  return (
    <>
      <h3 className="flex h-[46px] items-center justify-center text-center font-ppnb text-[36px] text-red1">
        <span className=" bg-black px-[24px]">Changes Failed</span>
      </h3>
    </>
  )
}

export default OpenVault
