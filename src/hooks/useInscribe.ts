import { useState } from 'react'
import { useSelector } from 'react-redux'
import { getAccountInfo, getLoginType } from '@/store/account/reducer'
import { LoginTypeEnum } from '@/types/common'
import { UnisatService } from '@/services/unisat'

const OUTPUT_VALUE = 546

export const useInscribe = () => {
  const loginType = useSelector(getLoginType)
  const { address } = useSelector(getAccountInfo)
  const [isInscribing, setInscribing] = useState(false)

  const okxInscribe = async () => {
    if (!window.okxwallet?.bitcoin?.mint) {
      throw Error('cannot find okx wallet')
    }

    try {
      setInscribing(true)
      const result = await window.okxwallet?.bitcoin.mint({
        type: 62,
        from: address,
        inscriptions: [
          {
            contentType: 'image/png',
            body: imgHex
          }
        ]
      })
      return result
    } catch (error) {
      console.error(error)
    } finally {
      setInscribing(false)
    }
  }

  const unisatInscribe = async () => {
    if (!window.unisat) {
      throw Error('cannot find unisat wallet')
    }

    try {
      setInscribing(true)
      const balance = await window.unisat.getBalance()

      const estimateAmout = estimateUnisatFee({
        address,
        feeRate: 1,
        fileCount: 1,
        fileSize: imgBase64.length,
        contentTypeSize: 'image/png'.length,
        feeFileSize: imgBase64.length,
        devFee: 0,
        serviceFee: true
      })

      if (balance.confirmed <= estimateAmout) {
        throw Error('insufficient balance')
      }

      const createRes = await UnisatService.createInscribeOrder.call({
        feeRate: 1,
        receiveAddress: address,
        outputValue: OUTPUT_VALUE,
        files: [
          {
            filename: 'bitSmiley',
            dataURL: imgBase64
          }
        ]
      })

      const amount = createRes.data.data.amount
      const payAddress = createRes.data.data.payAddress

      if (!amount || !payAddress) {
        throw Error('create order error')
      }

      const txid = await window.unisat.sendBitcoin(payAddress, amount)
      return txid
    } catch (error) {
      console.error(error)
    } finally {
      setInscribing(false)
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

  return { inscribe, isInscribing }
}

function estimateUnisatFee(data: {
  address: string
  fileSize: number
  fileCount: number
  contentTypeSize: number
  feeRate: number
  feeFileSize: number
  devFee: number
  serviceFee: boolean
}) {
  const feeFileCount = 25 // do not change this
  const address = data.address // the receiver address
  const inscriptionBalance = OUTPUT_VALUE // the balance in each inscription
  const fileCount = data.fileCount // the fileCount
  const fileSize = data.fileSize // the total size of all files
  const contentTypeSize = data.contentTypeSize // the size of contentType
  const feeRate = data.feeRate // the feeRate
  const feeFileSize = data.fileSize // the total size of first 25 files
  const devFee = data.devFee // the fee for developer

  const balance = inscriptionBalance * fileCount

  let addrSize = 25 + 1 // p2pkh
  if (address.indexOf('bc1q') == 0 || address.indexOf('tb1q') == 0) {
    addrSize = 22 + 1
  } else if (address.indexOf('bc1p') == 0 || address.indexOf('tb1p') == 0) {
    addrSize = 34 + 1
  } else if (address.indexOf('2') == 0 || address.indexOf('3') == 0) {
    addrSize = 23 + 1
  }

  const baseSize = 88
  let networkSats = Math.ceil(
    ((fileSize + contentTypeSize) / 4 + (baseSize + 8 + addrSize + 8 + 23)) *
      feeRate
  )
  if (fileCount > 1) {
    networkSats = Math.ceil(
      ((fileSize + contentTypeSize) / 4 +
        (baseSize +
          8 +
          addrSize +
          (35 + 8) * (fileCount - 1) +
          8 +
          23 +
          (baseSize + 8 + addrSize + 0.5) * (fileCount - 1))) *
        feeRate
    )
  }
  let networkSatsByFeeCount = Math.ceil(
    ((feeFileSize + contentTypeSize) / 4 + (baseSize + 8 + addrSize + 8 + 23)) *
      feeRate
  )
  if (fileCount > 1) {
    networkSatsByFeeCount = Math.ceil(
      ((feeFileSize + contentTypeSize * (feeFileCount / fileCount)) / 4 +
        (baseSize +
          8 +
          addrSize +
          (35 + 8) * (fileCount - 1) +
          8 +
          23 +
          (baseSize + 8 + addrSize + 0.5) *
            Math.min(fileCount - 1, feeFileCount - 1))) *
        feeRate
    )
  }

  const baseFee = 1999 * Math.min(fileCount, feeFileCount) // 1999 base fee for top 25 files
  const floatFee = Math.ceil(networkSatsByFeeCount * 0.0499) // 4.99% extra miner fee for top 25 transations
  const serviceFee = data.serviceFee ? Math.floor(baseFee + floatFee) : 0

  const total = balance + networkSats + serviceFee
  const truncatedTotal = Math.floor(total / 1000) * 1000 // truncate
  const amount = truncatedTotal + devFee // add devFee at the end

  return amount
}

const imgHex =
  '89504E470D0A1A0A0000000D49484452000000770000007708060000003939DF8A000000097048597300000B1300000B1301009A9C18000000017352474200AECE1CE90000000467414D410000B18F0BFC610500000191494441547801EDDD516A83401440D149E9FEB7DCA67FA5D06062D499CB391B50BC3C5067D03100000000000E711B0BF9BA1B17BBDD8D457C0CB2C40D13374CDC3071C3C40DBBECB6FE95C79A191E43563A6F931B266E98B861E286891B266ED8A1B7E88F1E1B565A5DD9EBAAEB6072C3C40D13374CDC3071C3C40DDB7D1BEE71679F23AF9FC90D13374CDC3071C3C40D13374CDC3071C3C40D1337EC734C6EEB26F077BFEABCEAB8EF6472C3364DAEC581E33CBA7E7BAFBBC90D13374CDC3071C3C40D13374CDC3071C3C40D13374CDC3071C3A65FF2BB6A61A2B0206272C3C40D13374CDC3071C3C40D13374CDC3071C3A67B43B56533F8956F8F663FBFDF4C6E98B861E286891B266ED8125F903BFB0EF5CCE3F9821C2F11374CDC3071C3C40D9B7EF7E38F2D9F1678E5EF987B8EBB02931B266E98B861E286891BB6C4DDF2233E72F63F7FE13C81BF70F276E286891B266E98B861E2864DBD73FFAF191E9F563A6F931B266E98B861E286891B266ED8522B33476C827BD64AAB5926374CDC3071C3C40D13374C5C00000000009EF50DB77860D70A8ABBBD0000000049454E44AE426082'

const imgBase64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHcAAAB3CAYAAAA5Od+KAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGRSURBVHgB7d1RaoNAFEDRSen+t9ymf6XQYGLUmcs5G1C8PFBn0DEAAAAAAA5xGwv5uhsXu92NRXwMssQNEzdM3DBxw8QNu+y2/pXHmhkeQ1Y6b5MbJm6YuGHihokbJm7Yobfojx4bVlpd2euq62Byw8QNEzdM3DBxw8QN230b7nFnnyOvn8kNEzdM3DBxw8QNEzdM3DBxw8QNEzfsc0xu6ybwd7/qvOq472RywzZNrsWB4zy6fnuvu8kNEzdM3DBxw8QNEzdM3DBxw8QNEzdM3DBxw6Zf8rtqYaKwIGJyw8QNEzdM3DBxw8QNEzdM3DBxw6Z7Q7VlM/iVb49mP7/fTG6YuGHihokbJm7YEl+QO/sO9czj+YIcLxE3TNwwccPEDZt+9+OPLZ8WeOXvmHuOuwKTGyZumLhh4oaJG7bE3fIjPnL2P3/hPIG/cPJ24oaJGyZumLhh4oZNvXP/rxken1Y6b5MbJm6YuGHihokbJm7YUiszR2yCe9ZKq1kmN0zcMHHDxA0TN0xcAAAAAACe9Q23eGDXCoq7vQAAAABJRU5ErkJggg=='
