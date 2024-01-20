import { useSelector } from 'react-redux'
import { getLoginType } from '@/store/account/reducer'
import { LoginTypeEnum } from '@/types/common'
import { UnisatService } from '@/services/unisat'
import { usePolling } from './usePolling'
import { useStoreActions } from './useStoreActions'
import { useUserInfo } from './useUserInfo'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { convertImageToBase64, convertImageToHex } from '@/utils/converter'
import { MempoolService } from '@/services/mempool'

const OUTPUT_VALUE = 546

export const useInscribe = () => {
  const loginType = useSelector(getLoginType)
  const { address } = useUserInfo()
  const { setTxId, setIsCreatingOrder } = useStoreActions()

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

      const imgHex = await convertImageToHex(
        getIllustrationUrl('bit-test', 'webp')
      )

      const res = await window.okxwallet?.bitcoin.mint({
        type: 62,
        from: address,
        inscriptions: [
          {
            contentType: 'image/webp',
            body: imgHex
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

      const imgBase64 = await convertImageToBase64(
        getIllustrationUrl('bit-test', 'webp')
      )

      const recommendedFeeRes = await MempoolService.getRecommendedFees.call()

      const createRes = await UnisatService.createInscribeOrder.call({
        feeRate: recommendedFeeRes?.data?.fastestFee || 30,
        receiveAddress: address,
        outputValue: OUTPUT_VALUE,
        files: [
          {
            filename: 'bitDisc',
            dataURL: imgBase64
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

  const inscribe = async () => {
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
