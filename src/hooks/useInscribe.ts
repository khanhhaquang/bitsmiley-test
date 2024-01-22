import { useSelector } from 'react-redux'
import { getLoginType } from '@/store/account/reducer'
import { LoginTypeEnum } from '@/types/common'
import { UnisatService } from '@/services/unisat'
import { usePolling } from './usePolling'
import { useStoreActions } from './useStoreActions'
import { useUserInfo } from './useUserInfo'
import { MempoolService } from '@/services/mempool'
import imgString from './imgString.json'
import { useProjectInfo } from './useProjectInfo'

const OUTPUT_VALUE = 546

export const useInscribe = () => {
  const loginType = useSelector(getLoginType)
  const { address } = useUserInfo()
  const { setTxId, setIsCreatingOrder } = useStoreActions()
  const { mintStartBlock } = useProjectInfo()

  const { resultRef: orderInfoRes, doPolling: pollOrderInfo } = usePolling({
    request: UnisatService.searchInscribeOrder.call,
    shouldContinue: (data) => !data?.data?.files?.[0]?.inscriptionId
  })

  const { resultRef: inscriptionInfoRes, doPolling: pollInscriptionInfo } =
    usePolling({
      request: UnisatService.getInscriptionInfo.call,
      shouldContinue: (data) => !data?.data?.utxo?.txid
    })

  const okxInscribe = async () => {
    if (!window.okxwallet?.bitcoin?.mint) {
      throw Error('cannot find okx wallet')
    }

    try {
      setIsCreatingOrder(true)

      const res = await window.okxwallet?.bitcoin.mint({
        type: 62,
        from: address,
        inscriptions: [
          {
            contentType: 'image/png',
            body: imgString.hex
          }
        ]
      })

      setTxId(res.commitTx)
      return res.commitTx
    } catch (error) {
      console.error(error)
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const unisatInscribe = async () => {
    if (!window.unisat) {
      throw Error('cannot find unisat wallet')
    }

    try {
      setIsCreatingOrder(true)

      const recommendedFeeRes = await MempoolService.getRecommendedFees.call()

      const createRes = await UnisatService.createInscribeOrder.call({
        feeRate: recommendedFeeRes?.data?.fastestFee || 30,
        receiveAddress: address,
        outputValue: OUTPUT_VALUE,
        files: [
          {
            filename: 'bitDisc',
            dataURL: imgString.base64
          }
        ]
      })

      const amount = createRes.data.data?.amount
      const payAddress = createRes.data.data?.payAddress

      if (!amount || !payAddress) {
        throw Error('create order error')
      }

      await window.unisat.sendBitcoin(payAddress, amount)

      const orderId = createRes?.data?.data?.orderId

      if (!orderId) {
        throw Error('cannot get unisat orderId')
      }

      await pollOrderInfo(orderId)

      const inscriptionId =
        orderInfoRes.current?.data?.files?.[0]?.inscriptionId

      if (!inscriptionId) {
        throw Error('cannot get unisat inscriptionId')
      }

      await pollInscriptionInfo(inscriptionId)

      const txid = inscriptionInfoRes.current?.data?.utxo?.txid

      if (!txid) {
        throw Error('cannot get unisat txid')
      }

      setTxId(txid)
      return txid
    } catch (error) {
      console.error(error)
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const checkingMintingStarted = async () => {
    setIsCreatingOrder(true)
    try {
      const currentBlockHeightRes =
        await MempoolService.getBlockTipHeight.call()
      if (currentBlockHeightRes.data < mintStartBlock) {
        setIsCreatingOrder(false)
        throw Error('minting not started yet')
      }
    } catch (e) {
      setIsCreatingOrder(false)
      throw Error('minting not started yet')
    }
  }

  const inscribe = async () => {
    await checkingMintingStarted()

    if (loginType === LoginTypeEnum.OKX) {
      const res = await okxInscribe()
      return res
    }

    if (loginType === LoginTypeEnum.UNISAT) {
      const res = await unisatInscribe()
      return res
    }

    return null
  }

  return { inscribe }
}
