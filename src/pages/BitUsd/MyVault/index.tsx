import React, { useState, useEffect, useCallback } from 'react'
import { Image } from '@/components/Image'
import { TitleBox } from '@/components/Title'
import './index.scss'
import { getOpenUrl, openUrl } from '@/utils/getAssetsUrl'
import { parseEther, formatEther as viemFormatEther } from 'viem'
import { SCANTXHASH } from '@/config/links'
import {
  formatDecimal,
  formatMoney,
  processInput,
  formatAmountThousands
} from '@/utils/formatter'
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
import { OverviewBox } from '@/components/OverviewBox'
import { cn } from '@/utils/cn'
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
  const liquidationValues: number = 100
  const { mintingPair, isLoading } = useMintingPairs(pairChainId)
  const [disableButton, setDisableButton] = useState(false)
  const [inputNum, setInputNum] = useState('0')
  const [inputValue, setInputValue] = useState('0')
  const [withdrawValue, setWithdrawValue] = useState('0')
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

  const {
    vaultManagerData,
    refetchVaultManagerData,
    vaultManagerAfterData,
    refetchVaultManagerAfterData
  } = useUserVaultManagerChange(inputNum, isDeposit, coinType)
  // console.log(vaultManagerData)

  const [txnId, setTxnId] = useState<Hash>()
  const { status } = useWaitForTransactionReceipt({ hash: txnId })

  const { oraclePrice1, refetchOraclePrice1 } = useGetOraclePrice()
  // console.log(oraclePrice1)
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
      setDisableButton(false)
      refetchisAllowanceVaultManager()
      refetchisBitUSDAllowance()
      refetchBalanceWBTC()
      refetchBalanceBitUSD()
      refetchVaultManagerData()
      if (isTxStatus == 1) {
        setIsStateValue(2)
        setIsApprove(true)
      } else {
        setIsStateValue(3)
        setOverviewAfterDataInit({
          liquidationPrice: 0,
          healthFactor: 0,
          debtBitUSD: 0,
          lockedCollateral: 0,
          availableToWithdraw: 0,
          availableToMint: 0
        })
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setOverviewDataInit(overviewInit as any)
  }

  const typeChangeFun = async (i: number) => {
    console.log(i)
    setInputValue('0')
    setWithdrawValue('0')
    setInputNum('0')
    setCoinType(i)
    // refetchVaultManagerData()
    setOverviewAfterDataInit({
      liquidationPrice: 0,
      healthFactor: 0,
      debtBitUSD: 0,
      lockedCollateral: 0,
      availableToWithdraw: 0,
      availableToMint: 0
    })
    // const overviewInit = await overviewData(1)
    // // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // setOverviewDataInit(overviewInit as any)
  }
  // console.log(vaultManagerData, gitBalanceBitUSD, gitBalanceWBTC)
  useEffect(() => {
    console.log(vaultManagerData, gitBalanceBitUSD, gitBalanceWBTC)
    console.log(vaultManagerData && gitBalanceBitUSD && gitBalanceWBTC)
    if (vaultManagerData) {
      console.log('vaultManagerData', vaultManagerData)
      setBitUsdBalance(formatEther(gitBalanceBitUSD?.toString()))
      setBalanceWBTC(formatEther(gitBalanceWBTC?.toString()))
      initData()
    }
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultManagerData, gitBalanceBitUSD, gitBalanceWBTC])
  const overviewData = async (type: number) => {
    console.log(withdrawValue, inputNum)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any = {}
    if (type == 1) {
      result = vaultManagerData
    } else {
      result = vaultManagerAfterData
    }
    const arr = {
      liquidationPrice: Number(
        formatEther(result?.liquidationPrice.toString() || '')
      ),
      healthFactor: (Number(result?.healthFactor) / 1000) * 100,
      debtBitUSD: Number(formatEther(result?.debtBitUSD || '')),
      lockedCollateral: formatEther(result?.lockedCollateral.toString() || ''),
      availableToWithdraw: Number(
        formatEther(result?.availableToWithdraw.toString())
      ).toFixed(4),
      availableToMint: Number(
        formatEther(result?.availableToMint.toString() || '')
      ).toFixed(4)
    }
    console.log(arr)
    return arr
  }

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const num: string = processInput(event.target.value)
    setInputNum(num)
    setWithdrawValue(num)
    if (Number(num) < 0) return
    if (coinType == 1) {
      const ava = overviewDataInit?.availableToMint
      if (ava !== undefined && Number(num) > ava) {
        setWithdrawValue(formatDecimal(ava || '0', 4).toString())
        setInputNum(formatDecimal(ava || '0', 4).toString())
        if (ava != 0) {
          const overviewInit = await overviewData(0)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setOverviewAfterDataInit(overviewInit as any)
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
      } else {
        const overviewInit = await overviewData(0)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setOverviewAfterDataInit(overviewInit as any)
      }
    } else {
      const ava = overviewDataInit?.availableToWithdraw
      if (ava !== undefined && Number(num) > ava) {
        setWithdrawValue(formatDecimal(ava || '0', 4).toString())
        setInputNum(formatDecimal(ava || '0', 4).toString())
        if (ava != 0) {
          const overviewInit = await overviewData(0)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setOverviewAfterDataInit(overviewInit as any)
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
      } else {
        const overviewInit = await overviewData(0)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setOverviewAfterDataInit(overviewInit as any)
      }
    }
    refetchVaultManagerAfterData()
  }
  const getAfterData = async () => {
    const overviewInit = await overviewData(0)
    console.log(inputNum, overviewInit)
    if (inputNum != '0') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setOverviewAfterDataInit(overviewInit as any)
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
    if (vaultManagerAfterData) {
      getAfterData()
    }
  }, [vaultManagerAfterData])

  const handleInputChange1 = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const num = processInput(event.target.value)
    setInputValue(num)
    setInputNum(num)
    if (coinType == 1) {
      if (Number(num) > Number(bitUsdBalance)) {
        setInputValue(formatDecimal(bitUsdBalance || '0', 4).toString())
        setInputNum(formatDecimal(bitUsdBalance || '0', 4).toString())
        refetchVaultManagerAfterData()
        if (Number(bitUsdBalance) != 0) {
          const overviewInit = await overviewData(0)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setOverviewAfterDataInit(overviewInit as any)
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
      } else {
        const overviewInit = await overviewData(0)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setOverviewAfterDataInit(overviewInit as any)
      }
    } else {
      if (Number(num) > Number(balanceWBTC)) {
        setInputValue(formatDecimal(balanceWBTC || '0', 4).toString())
        setInputNum(formatDecimal(balanceWBTC || '0', 4).toString())
        refetchVaultManagerAfterData()
        if (Number(balanceWBTC) != 0) {
          const overviewInit = await overviewData(0)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setOverviewAfterDataInit(overviewInit as any)
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
      } else {
        const overviewInit = await overviewData(0)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setOverviewAfterDataInit(overviewInit as any)
      }
    }
  }

  const handOnFocusChange = () => {
    setIsDeposit(false)
    setInputNum(withdrawValue)
  }

  const handOnFocusChange1 = () => {
    setIsDeposit(true)
    setInputNum(inputValue)
  }

  const mintFromBTCFun = async (val: string, btcNum: string) => {
    if (coinType == 1) {
      if (Number(val) <= 0) return
    } else {
      if (Number(btcNum) <= 0) return
    }
    try {
      const USDAmount = parseEther(val.toString())
      const BTCAmount = parseEther(btcNum.toString())
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
            setInputValue('0')
            setWithdrawValue('0')
            setInputNum('0')
            setIsLodingValue(false)
            setIsStateValue(3)
          }
        }
      }
    } catch (err) {
      console.log(err)
      setDisableButton(false)
      setIsStateValue(1)
    }
  }

  const repayToBTCFun = async (val: string, btcNum: string) => {
    if (coinType == 1) {
      if (Number(val) <= 0) return
    } else {
      if (Number(btcNum) <= 0) return
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
          setInputValue('0')
          setWithdrawValue('0')
          setInputNum('0')
          setIsLodingValue(false)
          setIsStateValue(3)
        }
      }
    } catch (err) {
      console.log(err)
      setDisableButton(false)
      setIsStateValue(1)
    }
  }
  /*
   * coinType=1=>bitusd;coinType=0=>wBTC
   */
  const handNextisDeposit = async () => {
    const flag = await isGlobalStatus()
    if (!flag) {
      return
    }
    if (Number(inputNum) <= 0) {
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
          allowanceNum >= Number(inputNum)
            ? setIsApprove(true)
            : setIsApprove(false)
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
        allowanceNum >= Number(inputNum)
          ? setIsApprove(true)
          : setIsApprove(false)
      }
    }
    setIsStateValue(2)
  }
  const handClickConfirm = async () => {
    setDisableButton(true)
    setIsTxStatus(2)
    if (coinType == 1) {
      if (!isDeposit) {
        mintFromBTCFun(inputNum, '0')
      } else {
        console.log('return bitUSD', inputNum)
        repayToBTCFun(inputNum, '0')
      }
    } else {
      console.log('WBTC', isDeposit)
      if (!isDeposit) {
        repayToBTCFun('0', inputNum)
      } else {
        console.log('return bitUSD', inputNum)
        mintFromBTCFun('0', inputNum)
      }
    }
  }

  const approveFun = async () => {
    setIsTxStatus(1)
    console.log('approve start--->')
    try {
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
    } catch (err) {
      setDisableButton(false)
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
    setDisableButton(true)
    approveFun()
    // if (coinType == 1) {
    //   approveFun(BitUSDL2Contract, bitSmileyAddrees)
    // } else {
    //   approveFun(TokenContract, bitSmileyAddrees)
    // }
  }

  const handClickOk = () => {
    setInputValue('0')
    setWithdrawValue('0')
    setInputNum('0')
    setIsStateValue(1)
  }

  if (isLoading) return <Loading />
  if (!mintingPair) return null
  if (!isConnected) return <NotConnected />
  // if (isNetworkError) return <NetworkErrorPage />

  return (
    <div>
      <div>
        <div className=" mx-auto mt-[164px] max-w-[1434px]">
          <TitleBox message="My Vaults" isWhite={true} />
        </div>
        <div className=" container mx-auto">
          <dl className="mx-auto mt-[9px] max-w-[1530px] ">
            <dt className="mb-[16px]">
              <VaultTitleBar list={mintingPair} />
              {/* <ul
                className={cn(
                  'table_title_color flex justify-center font-ibmb'
                )}>
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
              </ul> */}
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
                <OverviewBox
                  liquidationValues={liquidationValues}
                  listData={overviewDataInit}
                  afterDataInit={overviewAfterDataInit}
                />
              </div>
            </div>
            <div className={cn('grid_bg relative flex-none')}>
              <div
                className={cn('blendMode_blue top-[20px] l-0 absolute')}></div>
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
                      inputNum={inputNum}
                      liquidationValues={liquidationValues}
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
                      handleBlur1={() => {}}
                      handleBlur={() => {}}
                      handleInputChange={handleInputChange}
                      handOnFocusChange={handOnFocusChange}
                    />
                  ) : isState == 2 ? (
                    <ConfirmBox
                      disableButton={disableButton}
                      type={coinType}
                      isApprove={isApprove}
                      afterDataInit={overviewAfterDataInit}
                      listData={overviewDataInit}
                      handApproveFun={() => !disableButton && handApproveFun()}
                      handClickBack={handClickBack}
                      handClickConfirm={() =>
                        !disableButton && handClickConfirm()
                      }
                    />
                  ) : isState == 3 ? (
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
          To earn bitPoint, connect your wallet to conitnue.
        </div>
      </div>
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
      <h3 className="flex h-[46px] items-center justify-center text-center font-ppnb text-[36px] text-red1">
        <span className=" bg-black px-[24px]">Changes Failed</span>
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
  liquidationValues: number
  isDeposit: boolean
  inputValue: string
  withdrawValue: string
  type: number
  listData?: overviewBoxObject
  bitUsdBalance: string | number
  price: string | number
  inputNum: string
  handOnFocusChange1: () => void
  handOnFocusChange: () => void
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handNextisDeposit: () => void
  handleInputChange1: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleBlur1: () => void
  handleBlur: () => void
}> = ({
  inputNum,
  liquidationValues,
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
  let isLiquidation: boolean = false
  if (
    listData != undefined &&
    listData.healthFactor != undefined &&
    listData.healthFactor <= liquidationValues &&
    listData.healthFactor > 0
  ) {
    isLiquidation = true
  }
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
          className={cn(
            'input_style flex h-[47px] w-auto items-center font-ibmb text-[36px] leading-[47px] hover:border-none ordinal slashed-zero tabular-nums',
            !isDeposit && 'text-white/[.5] opacity-50'
          )}
          placeholder="0"
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
              formatDecimal((price as number) * Number(inputValue), 4)
            )}{' '}
            USD
          </p>
        ) : (
          <></>
        )}
      </div>
      <p className="h-[20px] text-center font-ibmr text-white">or</p>

      {type == 0 ? (
        <div
          className={cn(
            '-mt-[5px] mb-[7px] flex items-center justify-between font-ibmr text-[14px] text-white'
          )}>
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
      <div
        className={cn(
          'mb-[15px] bg-black/[.35] px-[20px] py-[10px]',
          isLiquidation && 'bg-white/[.2] rounded-[12px]'
        )}>
        <input
          type="number"
          placeholder="0"
          className={cn(
            'input_style  flex h-[47px] w-auto items-center font-ibmb text-[36px] leading-[47px] hover:border-none',
            isLiquidation || (isDeposit && 'text-white/[.5] opacity-50'),
            isLiquidation && 'cursor-not-allowed'
          )}
          readOnly={isLiquidation || isDeposit}
          onFocus={handOnFocusChange}
          onBlur={handleBlur}
          value={withdrawValue}
          onChange={handleInputChange}
        />
        {type == 0 ? (
          <p
            className={cn(
              'mt-3 font-ibmr text-[16px] text-white/[.8]',
              isLiquidation && 'text-white/[.2]'
            )}>
            ~
            {formatMoney(
              formatDecimal((price as number) * Number(withdrawValue), 4)
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
          className={cn(
            'cursor-pointer relative flex h-[77px] w-[517px] items-center justify-between border-y-[3px] border-solid border-white bg-blue',
            Number(inputNum) <= 0 && 'bg-[#5C5C5C] border-[#828282]'
          )}
          onClick={handNextisDeposit}>
          <div
            className={cn(
              'button_bg absolute -left-[6px] -top-[3px]',
              Number(inputNum) <= 0 && 'button_bg_disable h-[77px]'
            )}></div>
          <div
            className={cn(
              'button_bg absolute -right-[6px] -top-[3px] rotate-180',
              Number(inputNum) <= 0 && 'button_bg_disable h-[77px]'
            )}></div>
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
  disableButton: boolean
  isApprove: boolean
  listData?: overviewBoxObject
  afterDataInit: overviewBoxObject
  type: number
  handApproveFun: () => void
  handClickBack: () => void
  handClickConfirm: () => void
}> = ({
  type = 0,
  disableButton,
  isApprove,
  listData,
  afterDataInit,
  handClickConfirm,
  handClickBack,
  handApproveFun
}) => {
  if (!listData) return null
  const wBTCitems = [
    {
      name: 'Collateral locked',
      num1:
        formatAmountThousands((listData.lockedCollateral || 0).toString(), 4) +
        ' wBTC',
      num2:
        formatAmountThousands(
          (afterDataInit.lockedCollateral || 0).toString(),
          4
        ) + ' wBTC'
    }
  ]
  const bitUsditems = [
    {
      name: 'Total debt',
      num1:
        formatAmountThousands((listData.debtBitUSD || 0).toString(), 4) +
        'bitUSD',
      num2:
        formatAmountThousands((afterDataInit.debtBitUSD || 0).toString(), 4) +
        'bitUSD'
    }
  ]
  const commonParam = [
    {
      name: 'Health factor',
      num1: formatDecimal((listData.healthFactor || 0).toString(), 1) + ' %',
      num2:
        formatDecimal((afterDataInit.healthFactor || 0).toString(), 1) + ' %'
    },
    {
      name: 'Liquidation Price',
      num1:
        listData.liquidationPrice == 0
          ? '$ - '
          : '$ ' +
            formatAmountThousands(
              (listData.liquidationPrice || '-').toString(),
              2
            ),
      num2:
        afterDataInit.liquidationPrice == 0
          ? '$ - '
          : '$ ' +
            formatAmountThousands(
              (afterDataInit.liquidationPrice || '-').toString(),
              2
            )
    },
    {
      name: 'Available to mint',
      num1:
        '$ ' +
        formatAmountThousands((listData.availableToMint || 0).toString(), 2),
      num2:
        '$ ' +
        formatAmountThousands(
          (afterDataInit.availableToMint || 0).toString(),
          2
        )
    },
    {
      name: 'Available to withdraw',
      num1:
        formatAmountThousands(
          (listData.availableToWithdraw || 0).toString(),
          4
        ) + ' wBTC',
      num2:
        formatAmountThousands(
          (afterDataInit.availableToWithdraw || 0).toString(),
          4
        ) + ' wBTC'
    }
  ]
  let arr = []
  type == 0
    ? (arr = [...wBTCitems, ...commonParam])
    : (arr = [...bitUsditems, ...commonParam])
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

      <div
        className={cn(
          'absolute bottom-[34px] mt-[28px] flex w-[520px] justify-between'
        )}>
        <button
          className={cn(
            'bg-[#000000]/.5 relative cursor-pointer flex h-[77px] w-[233px] items-center justify-center border-y-[3px] border-solid border-white'
          )}
          onClick={handClickBack}>
          <div
            className={cn('button_bg3 absolute -left-[6px] -top-[3px]')}></div>
          <div
            className={cn(
              'button_bg3 absolute -right-[6px] -top-[3px] rotate-180'
            )}></div>
          <span className="font-ppnb text-[48px] text-white">Back</span>
        </button>
        {!isApprove ? (
          <div
            className={cn(
              'relative cursor-pointer flex h-[77px] w-[233px] items-center justify-center border-y-[3px] border-solid border-white bg-blue',
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
            <span className="ml-[21px] font-ppnb text-[48px] text-white">
              Approve
            </span>
            <Tooltip>
              <TooltipTrigger>
                <Image
                  src={getOpenUrl('Union02')}
                  className="ml-2 mr-[21px] w-[22px]"
                />
              </TooltipTrigger>
              <TooltipContent>
                To continue, you need to allow bitSmiley smart contracts to use
                your wBTC. This has to be done only once for each token.
              </TooltipContent>
            </Tooltip>
          </div>
        ) : (
          <button
            className={cn(
              'relative cursor-pointer flex h-[77px] w-[233px] items-center justify-center border-y-[3px] border-solid border-white bg-blue',
              disableButton && 'bg-[#5C5C5C] border-[#828282]'
            )}
            onClick={handClickConfirm}>
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
            className={cn(
              'cursor-pointer relative flex h-[77px] w-[517px] items-center justify-center border-y-[3px] border-solid border-white/[.5] bg-white/[.2]'
            )}>
            <div
              className={cn(
                'button_bg2 absolute -left-[6px] -top-[3px]'
              )}></div>
            <div
              className={cn(
                'button_bg2 absolute -right-[6px] -top-[3px] rotate-180'
              )}></div>
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
              className={cn(
                'cursor-pointer relative flex h-[77px] w-[517px] items-center justify-center border-y-[3px] border-solid border-white bg-blue'
              )}
              onClick={handClickOk}>
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
              className="relative flex h-[77px] w-[517px] cursor-pointer items-center justify-between border-y-[3px]
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

export default MyVault
