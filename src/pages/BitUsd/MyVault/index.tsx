import React, { useState, useEffect, useCallback } from 'react'
import { Image } from '@/components/Image'
import { Header } from '@/components/Header'
import { TitleBox } from '@/components/Title'
import './index.scss'
import { getOpenUrl, openUrl } from '@/utils/getAssetsUrl'
import { parseEther, formatEther as viemFormatEther } from 'viem'
import { SCANTXHASH } from '@/config/links'
import { formatDecimal, formatMoney } from '@/utils/formatter'
import { bitSmileyABI, bitUSDABI } from '@/abi/abi'
import LoadingAnimation from '@/components/LoadingAnimation'

import useContractAddresses from '@/hooks/useNetworkAddresses'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useUserInfo } from '@/hooks/useUserInfo'

import useUserVaultManagerChange from '@/hooks/useUserVaultManagerChange'
import useGetOraclePrice from '@/hooks/useGetOraclePrice'
import useWBTCContract from '@/hooks/useWBTCContract'
import { useStoreActions } from '@/hooks/useStoreActions'
import useGetUservault from '@/hooks/useGetUservault'
import useBitUSDContract from '@/hooks/useBitUSDContract'
import { useMintingPairs } from '@/hooks/useMintingPairs'
import { useParams } from 'react-router-dom'
import { Hash } from 'viem'
interface overviewBoxObject {
  availableToMint?: number
  debtBitUSD?: number
  collateralRate?: number
  lockedCollateral?: number
  liquidationPrice?: number
  availableToWithdraw?: number
}

// interface contractAddressInfo {
//   BitUSDL2: string
//   BitSmiley: string
//   VaultManager: string
//   oracle: string
//   WBTC: string
// }

const formatEther = (v?: bigint | boolean | number | string) =>
  viemFormatEther(BigInt(v || ''))

const MyVault: React.FC = () => {
  const params = useParams()
  const pairChainId = Number(params.chainId)
  const { mintingPair, isLoading } = useMintingPairs(pairChainId)
  const [inputNum, setInputNum] = useState(0)
  const [inputValue, setInputValue] = useState(0)
  const [withdrawValue, setWithdrawValue] = useState(0)
  const [isLoding, setIsLodingValue] = useState(false)
  //1=>Make Changes-next  ; 2=>Vault Changes-Vault Changes ; 3=>Changes Completed=>ok ;4=>Changes Failed
  const [isState, setIsStateValue] = useState(1)
  //1=>approve 2repay usdt
  const [isTxStatus, setIsTxStatus] = useState(2)
  //Deposit = true; withdraw/mint=false
  const [isDeposit, setIsDeposit] = useState(true)
  //0=>wBTC 1=>bitUSD
  const [coinType, setCoinType] = useState(0)
  // const [walletInfo, setWalletInfo] = useState<Array<string>>([])
  const [balanceWBTC, setBalanceWBTC] = useState('')
  const [isApprove, setIsApprove] = useState(false)
  const [oraclePrice, setOraclePriceOracle] = useState<string>('0')

  // const [AvailableBitUSD, setAvailableBitUSD] = useState(0)
  const [bitUsdBalance, setBitUsdBalance] = useState('')
  const [overviewDataInit, setOverviewDataInit] = useState<
    overviewBoxObject | undefined
  >({
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

  const {
    vaultManagerData,
    refetchVaultManagerData,
    vaultManagerAfterData,
    refetchVaultManagerAfterData
  } = useUserVaultManagerChange(inputNum, isDeposit, coinType)
  console.log(vaultManagerData)

  const [txnId, setTxnId] = useState<Hash>()
  const { status } = useWaitForTransactionReceipt({ hash: txnId })

  const { oraclePrice1, refetchOraclePrice1 } = useGetOraclePrice()
  console.log(oraclePrice1)
  const {
    isAllowanceVaultManager,
    refetchisAllowanceVaultManager,
    gitBalanceWBTC,
    refetchBalanceWBTC
  } = useWBTCContract()
  const {
    isBitUSDAllowance,
    gitBalanceBitUSD,
    refetchBalanceBitUSD,
    refetchisBitUSDAllowance
  } = useBitUSDContract()
  const { removeTransaction, addTransaction } = useStoreActions()
  const { vault1 } = useGetUservault()

  const isGlobalStatus = async () => {
    let flag = true
    if (!address) {
      flag = false
      // connectWallet()
    }
    return flag
  }

  useEffect(() => {
    let closeTimeout: NodeJS.Timeout
    if (status !== 'pending') {
      refetchisAllowanceVaultManager()
      refetchisBitUSDAllowance()
      refetchBalanceWBTC()
      refetchBalanceBitUSD()
      refetchVaultManagerData()
      refetchVaultManagerAfterData()
      // setInputValue(0)
      // setWithdrawValue(0)
      // setInputNum(0)
      if (isTxStatus == 1) {
        setIsStateValue(2)
        setIsApprove(true)
      } else {
        setIsStateValue(3)
      }

      setIsLodingValue(false)
      setTxnId(undefined)
      closeTimeout = setTimeout(() => {
        removeTransaction(txnId?.toString() || '')
      }, 5000)
    }
    ;() => {
      clearTimeout(closeTimeout)
    }
  }, [
    isTxStatus,
    refetchBalanceBitUSD,
    refetchBalanceWBTC,
    refetchVaultManagerAfterData,
    refetchVaultManagerData,
    refetchisAllowanceVaultManager,
    refetchisBitUSDAllowance,
    removeTransaction,
    status,
    txnId,
    vault1
  ])

  useEffect(() => {
    if (oraclePrice1) {
      setOraclePriceOracle(formatEther(oraclePrice1.toString()))
    }
  }, [oraclePrice1])

  const getRealTimeOracle = useCallback(async () => {
    refetchOraclePrice1()
    setOraclePriceOracle(formatEther(oraclePrice1?.toString() || ''))
  }, [oraclePrice1, refetchOraclePrice1])

  useEffect(() => {
    if (!oraclePrice1) return
    const timer = setInterval(() => [getRealTimeOracle()], 3000)
    return () => {
      clearInterval(timer)
    }
  }, [getRealTimeOracle, oraclePrice1])

  const initData = async () => {
    const overviewInit = await overviewData(1)
    console.log(overviewInit)
    setOverviewDataInit(overviewInit)
  }

  const typeChangeFun = async (i: number) => {
    console.log(i)
    setInputValue(0)
    setWithdrawValue(0)
    setInputNum(0)
    setCoinType(i)
    refetchVaultManagerData()
    const overviewInit = await overviewData(1)
    setOverviewDataInit(overviewInit)
  }
  console.log(vaultManagerData, gitBalanceBitUSD, gitBalanceWBTC)
  useEffect(() => {
    console.log(vaultManagerData, gitBalanceBitUSD, gitBalanceWBTC)
    console.log(vaultManagerData && gitBalanceBitUSD && gitBalanceWBTC)
    if (vaultManagerData) {
      console.log('vaultManagerData', vaultManagerData)
      setBitUsdBalance(formatEther(gitBalanceBitUSD.toString()))
      setBalanceWBTC(formatEther(gitBalanceWBTC.toString()))
      initData()
    }
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultManagerData, gitBalanceBitUSD, gitBalanceWBTC])
  const overviewData = async (type: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any = {}
    if (type == 1) {
      result = vaultManagerData
    } else {
      result = vaultManagerAfterData
    }
    console.log(vaultManagerData, vaultManagerAfterData)
    // const result = vaultManagerData
    const arr = {
      liquidationPrice: Number(
        formatEther(result.liquidationPrice.toString() || '')
      ),
      collateralRate: (Number(result.collateralRate) / 1000) * 100,
      debtBitUSD: Number(formatEther(result.debtBitUSD || '')),
      lockedCollateral: Number(
        formatEther(result.lockedCollateral.toString() || '')
      ),
      availableToWithdraw: Number(
        formatEther(result.availableToWithdraw.toString())
      ),
      availableToMint: Number(
        formatEther(result.availableToMint.toString() || '')
      )
    }
    console.log(arr)
    return arr
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^\d*\.?\d*$/
    const newValue = event.target.value
    if (regex.test(newValue)) {
      setWithdrawValue(Number(newValue))
      setInputNum(Number(newValue))
    }
  }

  const handleInputChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^\d*\.?\d*$/
    const newValue = event.target.value
    if (regex.test(newValue)) {
      setInputValue(Number(newValue))
      setInputNum(Number(newValue))
    }
  }

  const handOnFocusChange = () => {
    setIsDeposit(false)
  }

  const handOnFocusChange1 = () => {
    setIsDeposit(true)
  }

  const mintFromBTCFun = async (val: number, btcNum: number) => {
    if (coinType == 1) {
      if (val <= 0) return
    } else {
      if (btcNum <= 0) return
    }
    try {
      const USDAmount = parseEther(val.toString())
      const BTCAmount = parseEther(btcNum.toString())
      console.log(
        'vault1===',
        vault1,
        'bitUSDAmount',
        USDAmount.toString(),
        BTCAmount.toString()
      )
      const parameter = [vault1, USDAmount, BTCAmount]
      if (contractAddresses?.BitSmiley != undefined) {
        const txnId = await writeContractAsync({
          abi: bitSmileyABI,
          address: contractAddresses?.BitSmiley,
          functionName: 'mintFromBTC',
          args: parameter
        })
        if (txnId) {
          setIsLodingValue(true)
          setTxnId(txnId)
          addTransaction(txnId)
          if (status !== 'pending') {
            setInputValue(0)
            setWithdrawValue(0)
            setInputNum(0)
            setIsLodingValue(false)
            setIsStateValue(3)
          }
        }
      }
    } catch (err) {
      console.log(err)
      setIsStateValue(1)
    }
  }

  const repayToBTCFun = async (val: number, btcNum: number) => {
    if (coinType == 1) {
      if (val <= 0) return
    } else {
      if (btcNum <= 0) return
    }

    try {
      const USDAmount = parseEther(val.toString())
      const BTCAmount = parseEther(btcNum.toString())
      console.log(
        'vault1===',
        vault1,
        'bitUSDAmount-',
        USDAmount.toString(),
        'WBTC--',
        BTCAmount.toString()
      )
      const parameter = [vault1, USDAmount, BTCAmount]
      if (contractAddresses?.BitSmiley != undefined) {
        const txnId = await writeContractAsync({
          abi: bitSmileyABI,
          address: contractAddresses?.BitSmiley,
          functionName: 'repayToBTC',
          args: parameter
        })
        setIsLodingValue(true)
        setTxnId(txnId)
        addTransaction(txnId)
        if (status !== 'pending') {
          setInputValue(0)
          setWithdrawValue(0)
          setInputNum(0)
          setIsLodingValue(false)
          setIsStateValue(3)
        }
      }
    } catch (err) {
      console.log(err)
      setIsStateValue(1)
    }
  }
  const handleInputBlurMint1 = async () => {
    console.log('---', inputValue)
    if (coinType == 1) {
      if (inputValue > Number(bitUsdBalance)) {
        setInputValue(Number(formatDecimal(bitUsdBalance, 4)))
        setInputNum(Number(formatDecimal(bitUsdBalance, 4)))
      }
    } else {
      if (inputValue > Number(balanceWBTC)) {
        setInputValue(Number(formatDecimal(balanceWBTC, 4)))
        setInputNum(Number(formatDecimal(balanceWBTC, 4)))
      }
    }
    const overviewInit = await overviewData(0)
    console.log('====>---', overviewInit)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setOverviewAfterDataInit(overviewInit as any)
  }

  const handleInputBlurMint = async () => {
    console.log(withdrawValue, -withdrawValue)
    if (withdrawValue < 0) return
    if (coinType == 1) {
      const ava = overviewDataInit?.availableToMint
      if (ava !== undefined && withdrawValue > ava) {
        setWithdrawValue(Number(formatDecimal(ava, 2)))
        setInputNum(Number(formatDecimal(ava, 2)))
      }
    } else {
      const ava = overviewDataInit?.availableToWithdraw
      if (ava !== undefined && withdrawValue > ava) {
        setWithdrawValue(Number(formatDecimal(ava, 2)))
        setInputNum(Number(formatDecimal(ava, 2)))
      }
    }
    refetchVaultManagerAfterData()
    const overviewInit = await overviewData(0)
    console.log('====>---', overviewInit)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setOverviewAfterDataInit(overviewInit as any)
  }
  /*
   * coinType=1=>bitusd;coinType=0=>wBTC
   */
  const handNextisDeposit = async () => {
    const flag = await isGlobalStatus()
    if (!flag) {
      return
    }
    setIsApprove(true)
    console.log(isDeposit)
    if (coinType == 1) {
      if (!isDeposit) {
        //mint bitusd
      } else {
        //repay bitusd
        console.log('repay bitusd')
        if (isBitUSDAllowance != undefined) {
          const allowanceNum = Number(formatEther(isBitUSDAllowance.toString()))
          console.log(allowanceNum)
          allowanceNum >= inputValue ? setIsApprove(true) : setIsApprove(false)
        }
      }
    } else {
      if (!isDeposit) {
        //withdraw
        console.log('withdraw')
      } else {
        //deposit wBTC
        console.log('deposit wBTC')
        const allowanceNum = Number(
          formatEther(isAllowanceVaultManager?.toString() || '')
        )
        console.log(allowanceNum)
        allowanceNum >= inputValue ? setIsApprove(true) : setIsApprove(false)
      }
    }
    setIsStateValue(2)
  }
  const handClickConfirm = async () => {
    setIsTxStatus(2)
    if (coinType == 1) {
      if (!isDeposit) {
        mintFromBTCFun(withdrawValue, 0)
      } else {
        console.log('return bitUSD', inputValue)
        repayToBTCFun(inputValue, 0)
      }
    } else {
      console.log('WBTC', isDeposit)
      if (!isDeposit) {
        repayToBTCFun(0, withdrawValue)
      } else {
        console.log('return bitUSD', inputValue)
        mintFromBTCFun(0, inputValue)
      }
    }
  }

  const approveFun = async () => {
    setIsTxStatus(1)
    console.log('approve start--->')
    const addressApprove = contractAddresses?.BitSmiley
    let contractApprove = contractAddresses?.BitUSDL2
    if (coinType == 0) {
      contractApprove = contractAddresses?.WBTC
    }
    if (contractApprove != undefined) {
      const txnId = await writeContractAsync({
        abi: bitUSDABI,
        address: contractApprove,
        functionName: 'approve',
        args: [addressApprove, parseEther(inputValue.toString())]
      })
      console.log(txnId)
      setIsLodingValue(true)
      setTxnId(txnId)
      addTransaction(txnId)
      if (status !== 'pending') {
        setIsLodingValue(false)
        setIsApprove(true)
      }
    }
  }

  const handClickBack = () => {
    setIsStateValue(1)
  }

  const handApproveFun = async () => {
    const flag = await isGlobalStatus()
    if (!flag) {
      return
    }
    approveFun()
    // if (coinType == 1) {
    //   approveFun(BitUSDL2Contract, bitSmileyAddrees)
    // } else {
    //   approveFun(TokenContract, bitSmileyAddrees)
    // }
  }

  const handClickOk = () => {
    setInputValue(0)
    setWithdrawValue(0)
    setInputNum(0)
    setIsStateValue(1)
  }

  if (isLoading) return <div>loading...</div>
  if (!mintingPair) return null

  // if (isNetworkError) return <NetworkErrorPage />

  return (
    <div>
      <Header wallet />
      <div>
        <div className=" mx-auto mt-[164px] max-w-[1434px]">
          <TitleBox message="My Vaults" isWhite={true} />
        </div>
        <div className=" container mx-auto">
          <dl className="mx-auto mt-[9px] max-w-[1220px] ">
            <dt className="mb-[16px]">
              <ul className="table_title_color flex justify-center font-ibmb">
                {/* <li className="text-center mr-[50px]">Stability fee : 5.25% ⓘ</li>
                <li className="text-center mr-[50px]">Liquidity fee: 13% ⓘ</li>
                <li className="text-center mr-[50px]">Min Size: 0.5 BTC ⓘ</li>
                <li className="text-center mr-[50px]">Max LTV: 50% ⓘ</li> */}
                <li className="mr-[50px] text-center">
                  Stability fee: {Number(mintingPair.borrowRate) * 100}% ⓘ{' '}
                </li>
                <li className="mr-[50px] text-center">Liquidity fee: 50% ⓘ </li>
                <li className="mr-[50px] text-center">
                  Min Size: {mintingPair.minSize} $ ⓘ
                </li>
                <li className="mr-[50px] text-center">
                  Max LTV: {Number(mintingPair.maxLTV) * 100}% ⓘ
                </li>
              </ul>
            </dt>
          </dl>
          <div className="line_bottom mb-[31px]"></div>

          <div className="flex justify-center pb-[250px]">
            <div className="grid_bg relative mr-[99px] h-[528px] w-[629px] flex-none">
              <div className="blendMode t-0 l-0 absolute"></div>
              <div className="relative h-[528px]">
                <CornerPin></CornerPin>
                <TitleBlock titleValue="Overview"></TitleBlock>
                <MintBitUsdOverviewBox
                  listData={overviewDataInit}
                  afterDataInit={overviewAfterDataInit}
                />
              </div>
            </div>
            <div className="grid_bg relative flex-none">
              <div className="blendMode_blue t-0 l-0 absolute"></div>
              <div className="relative h-[528px] w-[629px] px-[53px] ">
                <CornerPin></CornerPin>
                {isState == 4 ? (
                  <FailedTitleBlock />
                ) : (
                  <TitleBlock
                    titleValue={`${
                      isState == 2
                        ? 'Vault Changes'
                        : isState == 3
                          ? 'Changes Completed'
                          : 'Make Changes'
                    }`}></TitleBlock>
                )}

                {isState == 1 ? (
                  <TabBar
                    type={coinType}
                    handClickTypeChange={(i) => typeChangeFun(i)}
                  />
                ) : (
                  ''
                )}

                <div>
                  {isLoding ? (
                    <LoadingBox
                      openUrlClick={() => openUrl(`${SCANTXHASH.test}${txnId}`)}
                    />
                  ) : isState == 1 ? (
                    <SetupVault
                      type={coinType}
                      listData={overviewDataInit}
                      isDeposit={isDeposit}
                      bitUsdBalance={bitUsdBalance}
                      price={oraclePrice}
                      inputValue={inputValue}
                      withdrawValue={withdrawValue}
                      handNextisDeposit={handNextisDeposit}
                      handleInputChange1={handleInputChange1}
                      handOnFocusChange1={handOnFocusChange1}
                      handleBlur1={handleInputBlurMint1}
                      handleBlur={handleInputBlurMint}
                      handleInputChange={handleInputChange}
                      handOnFocusChange={handOnFocusChange}
                    />
                  ) : isState == 2 ? (
                    <ConfirmBox
                      type={coinType}
                      isApprove={isApprove}
                      afterDataInit={overviewAfterDataInit}
                      listData={overviewDataInit}
                      handApproveFun={handApproveFun}
                      handClickBack={handClickBack}
                      handClickConfirm={handClickConfirm}
                    />
                  ) : // <MintBitUSDBox toastMsg="ly created a vault. You can find it in “My Vault”. Continue to mint bitUSD from this vault"/>:
                  isState == 3 ? (
                    <MintBitUSDBox
                      isOk={true}
                      handleClick={() => {}}
                      handClickOk={handClickOk}
                      toastMsg="Your vault change is completed."
                    />
                  ) : (
                    <MintBitUSDBox
                      isOk={true}
                      handleClick={() => {}}
                      handClickOk={handClickOk}
                      toastMsg="Your vault change has encountered an error ⓘ. Please try again"
                    />
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

const TabBar: React.FC<{
  type: number
  handClickTypeChange: (i: number) => void
}> = ({ type, handClickTypeChange }) => {
  const items = [
    { id: 1, name: 'wBTC' },
    { id: 2, name: 'bitUSD' }
  ]
  const renderedItems = items.map((item, index) => (
    <span
      key={index}
      className={`${
        type == index
          ? 'bg-blue text-black transition duration-200 ease-in'
          : 'text-white transition duration-200 ease-in'
      } inline-block 
        cursor-pointer px-[12px] py-[2px] active:bg-blue`}
      onClick={() => handClickTypeChange(index)}>
      {item.name}
    </span>
  ))
  return (
    <>
      <div className="mt-[5px] border-b-[1px] border-blue font-ibmr">
        {renderedItems}
        {/* <span className="inline-block px-[12px] py-[2px] active:bg-blue text-white cursor-pointer">bitUSD</span> */}
      </div>
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
const FailedTitleBlock: React.FC = () => {
  return (
    <>
      <h3 className="flex h-[46px] items-center justify-center text-center font-ppnb text-[36px] text-[#FF0000]">
        <span className=" bg-black px-[24px]">Changes Failed</span>
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
  isDeposit: boolean
  inputValue: number
  withdrawValue: number
  type: number
  listData?: overviewBoxObject
  bitUsdBalance: string | number
  price: string | number
  handOnFocusChange1: () => void
  handOnFocusChange: () => void
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handNextisDeposit: () => void
  handleInputChange1: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleBlur1: () => void
  handleBlur: () => void
}> = ({
  price,
  handleBlur1,
  handleBlur,
  bitUsdBalance,
  handleInputChange1,
  handNextisDeposit,
  inputValue,
  isDeposit,
  handOnFocusChange1,
  withdrawValue,
  handOnFocusChange,
  type,
  listData,
  handleInputChange
}) => {
  if (!listData) return null
  return (
    <>
      {type == 0 ? (
        <div className="mb-[14px] mt-[15px] flex items-center justify-between font-ibmr text-[14px] text-white">
          <span>Deposit wBTC</span>
        </div>
      ) : type == 1 ? (
        <div className="mb-[14px] mt-[25px] flex items-center justify-between font-ibmr text-[14px] text-white">
          <span>Repay bitUSD</span>
          <span>
            Total Debt: {formatMoney(formatDecimal(Number(bitUsdBalance), 4))}
          </span>
        </div>
      ) : (
        <></>
      )}
      <div className="mb-[15px] bg-black/[.35] px-[20px] py-[10px]">
        <input
          type="number"
          className={`input_style flex h-[47px] w-auto items-center font-ibmb
        text-[36px] leading-[47px] hover:border-none ${
          !isDeposit ? 'text-white/[.5] opacity-50' : ''
        }`}
          readOnly={!isDeposit}
          onFocus={handOnFocusChange1}
          onBlur={handleBlur1}
          value={inputValue}
          onChange={handleInputChange1}
        />
        {type == 0 ? (
          <p className="mt-3 font-ibmr text-[16px] text-white/[.8]">
            ~
            {formatMoney(
              formatDecimal((price as number) * (inputValue as number), 4)
            )}{' '}
            USD
          </p>
        ) : (
          <></>
        )}
      </div>
      <p className="h-[20px] text-center font-ibmr text-white">or</p>

      {type == 0 ? (
        <div className="-mt-[5px] mb-[7px] flex items-center justify-between font-ibmr text-[14px] text-white">
          <span>Withdraw</span>
          <span>
            Max:{' '}
            {formatMoney(formatDecimal(listData.availableToWithdraw || 0, 4))}
          </span>
        </div>
      ) : type == 1 ? (
        <div className="mb-[14px] mt-[26px] flex items-center justify-between font-ibmr text-[14px] text-white">
          <span>Mint</span>
          <span>
            Max: {formatMoney(formatDecimal(listData.availableToMint || 0, 4))}
          </span>
        </div>
      ) : (
        <></>
      )}

      {/* readOnly text-white/[.5] opacity-50*/}
      <div className="mb-[15px] bg-black/[.35] px-[20px] py-[10px]">
        <input
          type="number"
          min="1"
          className={`input_style  flex h-[47px] w-auto items-center font-ibmb
        text-[36px] leading-[47px] hover:border-none ${
          isDeposit ? 'text-white/[.5] opacity-50' : ''
        }`}
          readOnly={isDeposit}
          onFocus={handOnFocusChange}
          onBlur={handleBlur}
          value={withdrawValue}
          onChange={handleInputChange}
        />
        {type == 0 ? (
          <p className="mt-3 font-ibmr text-[16px] text-white/[.8]">
            ~
            {formatMoney(
              formatDecimal((price as number) * (withdrawValue as number), 4)
            )}{' '}
            USD
          </p>
        ) : (
          <></>
        )}
      </div>
      <div
        className={`flex justify-center ${
          type == 1 ? 'mt-[50px]' : 'mt-[28px]'
        } `}>
        <button
          className="relative flex h-[77px] w-[517px] items-center justify-between border-y-[3px]
          border-solid border-white bg-blue"
          onClick={handNextisDeposit}>
          <div className="button_bg absolute -left-[6px] -top-[3px]"></div>
          <div className="button_bg absolute -right-[6px] -top-[3px] rotate-180"></div>
          <span className="ml-[21px] font-ppnb text-[48px] text-white">
            Next
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

const ConfirmBox: React.FC<{
  isApprove: boolean
  listData?: overviewBoxObject
  afterDataInit: overviewBoxObject
  type: number
  handApproveFun: () => void
  handClickBack: () => void
  handClickConfirm: () => void
}> = ({
  type = 0,
  isApprove,
  listData,
  afterDataInit,
  handClickConfirm,
  handClickBack,
  handApproveFun
}) => {
  if (!listData) return null
  const items = [
    {
      id: 1,
      name: 'Collateral locked',
      num1:
        formatMoney(formatDecimal(listData.availableToWithdraw || 0, 4)) +
        ' BTC',
      num2:
        formatMoney(formatDecimal(afterDataInit.availableToWithdraw || 0, 4)) +
        ' wBTC'
    },
    {
      id: 2,
      name: 'Health factor',
      num1: formatMoney(formatDecimal(listData.collateralRate || 0, 2)) + '%',
      num2:
        formatMoney(formatDecimal(afterDataInit.collateralRate || 0, 2)) + '%'
    },
    {
      id: 3,
      name: 'Liquidation price',
      num1:
        '$ ' + formatMoney(formatDecimal(listData.liquidationPrice || 0, 2)),
      num2:
        '$ ' +
        formatMoney(formatDecimal(afterDataInit.liquidationPrice || 0, 2))
    },
    {
      id: 4,
      name: 'Available to mint',
      num1: '$ ' + formatMoney(formatDecimal(listData.availableToMint || 0, 4)),
      num2:
        '$ ' + formatMoney(formatDecimal(afterDataInit.availableToMint || 0, 4))
    },
    {
      id: 5,
      name: 'Available to withdraw',
      num1:
        formatMoney(formatDecimal(listData.availableToWithdraw || 0, 4)) +
        ' wBTC',
      num2:
        formatMoney(formatDecimal(afterDataInit.availableToWithdraw || 0, 4)) +
        ' wBTC'
    }
  ]
  const items2 = [
    {
      id: 1,
      name: 'Total debt',
      num1: '$ ' + formatMoney(formatDecimal(listData.debtBitUSD || 0, 4)),
      num2: '$ ' + formatMoney(formatDecimal(afterDataInit.debtBitUSD || 0, 4))
    },
    {
      id: 2,
      name: 'Health factor',
      num1: formatMoney(formatDecimal(listData.collateralRate || 0, 2)) + ' %',
      num2:
        formatMoney(formatDecimal(afterDataInit.collateralRate || 0, 2)) + ' %'
    },
    {
      id: 3,
      name: 'Liquidation Price',
      num1:
        '$ ' + formatMoney(formatDecimal(listData.liquidationPrice || 0, 2)),
      num2:
        '$ ' +
        formatMoney(formatDecimal(afterDataInit.liquidationPrice || 0, 2))
    },
    {
      id: 4,
      name: 'Available to mint',
      num1: '$ ' + formatMoney(formatDecimal(listData.availableToMint || 0, 4)),
      num2:
        '$ ' + formatMoney(formatDecimal(afterDataInit.availableToMint || 0, 4))
    },
    {
      id: 5,
      name: 'Available to withdraw',
      num1:
        formatMoney(formatDecimal(listData.availableToWithdraw || 0, 4)) +
        ' wBTC',
      num2:
        formatMoney(formatDecimal(afterDataInit.availableToWithdraw || 0, 4)) +
        ' wBTC'
    }
  ]
  let arr = []
  type == 0 ? (arr = items) : (arr = items2)
  const renderedItems = arr.map((item, index) => (
    <li
      key={index}
      className="mb-[12px] flex h-[21px] items-center justify-between font-ibmr text-[16px] text-white">
      <span>{item.name}</span>
      <p className="flex items-center justify-between font-ibmb">
        <span>{item.num1}</span>
        <Image src={getOpenUrl('return')} className="ml-2 mr-[9px] w-[5px]" />
        <span className=""> {item.num2}</span>
      </p>
    </li>
  ))

  return (
    <>
      <ul className="mt-[59px]">{renderedItems}</ul>

      <div className="absolute bottom-[34px] mt-[28px] flex w-[520px] justify-between">
        <button
          className="bg-[#000000]/.5 relative flex h-[77px] w-[233px] items-center justify-center
          border-y-[3px] border-solid border-white"
          onClick={handClickBack}>
          <div className="button_bg3 absolute -left-[6px] -top-[3px]"></div>
          <div className="button_bg3 absolute -right-[6px] -top-[3px] rotate-180"></div>
          <span className="font-ppnb text-[48px] text-white">Back</span>
        </button>
        {!isApprove ? (
          <button
            className="relative flex h-[77px] w-[233px] items-center justify-center border-y-[3px]
          border-solid border-white bg-blue"
            onClick={handApproveFun}>
            <div className="button_bg absolute -left-[6px] -top-[3px]"></div>
            <div className="button_bg absolute -right-[6px] -top-[3px] rotate-180"></div>
            <span className="ml-[21px] font-ppnb text-[48px] text-white">
              Approve
            </span>
            <Image
              src={getOpenUrl('Union02')}
              className="ml-2 mr-[21px] w-[22px]"
            />
          </button>
        ) : (
          <button
            className="relative flex h-[77px] w-[233px] items-center justify-center border-y-[3px]
        border-solid border-white bg-blue"
            onClick={handClickConfirm}>
            <div className="button_bg absolute -left-[6px] -top-[3px]"></div>
            <div className="button_bg absolute -right-[6px] -top-[3px] rotate-180"></div>
            <span className="font-ppnb text-[48px] text-white">Confirm</span>
          </button>
        )}
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
  handClickOk: () => void
}> = ({ toastMsg, isOk = false, handleClick, handClickOk }) => {
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
              onClick={handClickOk}>
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
                className="ml-2 mr-[14px] w-[79px]"
              />
            </button>
          )}
        </div>
      </div>
    </>
  )
}

const MintBitUsdOverviewBox: React.FC<{
  listData?: overviewBoxObject
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
              ${formatMoney(formatDecimal(listData?.liquidationPrice || 0, 2))}
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
              {formatDecimal(listData?.collateralRate || 0, 2)} %
            </h1>
            <div className="relative flex h-[31px] w-[196px] items-center bg-black pl-[8px] font-ibmr text-white">
              {formatDecimal(afterDataInit.collateralRate || 0, 2)}% after ⓘ
            </div>
          </div>
          <div className="mt-[24px] w-[50%]">
            <p className="font-ibmr text-base">Vault Debt</p>
            <h1 className="mb-4 mt-1 font-ppnb text-[72px] leading-[51px]">
              ${formatMoney(formatDecimal(listData?.debtBitUSD || 0, 4))}
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
                formatDecimal(listData?.lockedCollateral || 0, 4)
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
                formatDecimal(listData?.availableToWithdraw || 0, 4)
              )}{' '}
              BTC
            </h1>
            <div className="relative flex h-[31px] w-auto min-w-[100px] items-center bg-black pl-[8px] font-ibmr text-[14px] text-white">
              {formatMoney(
                formatDecimal(afterDataInit.availableToWithdraw || 0, 4)
              )}{' '}
              after
            </div>
          </div>
          <div className="mt-[24px]">
            <p className="whitespace-nowrap font-ibmr text-[14px]">
              Available to mint
            </p>
            <h1 className="mb-[6px] whitespace-nowrap font-ppnb text-[32px] leading-[32px]">
              {' '}
              {formatMoney(
                formatDecimal(listData?.availableToMint || 0, 4)
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

export default MyVault
