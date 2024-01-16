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
            contentType: 'image/webp',
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
      // const balance = await window.unisat.getBalance()

      // const estimateAmout = estimateUnisatFee({
      //   address,
      //   feeRate: 1,
      //   fileCount: 1,
      //   fileSize: imgBase64.length,
      //   contentTypeSize: 'image/webp'.length,
      //   feeFileSize: imgBase64.length,
      //   devFee: 0,
      //   serviceFee: true
      // })

      // if (balance.confirmed <= estimateAmout) {
      //   throw Error('insufficient balance')
      // }

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

// function estimateUnisatFee(data: {
//   address: string
//   fileSize: number
//   fileCount: number
//   contentTypeSize: number
//   feeRate: number
//   feeFileSize: number
//   devFee: number
//   serviceFee: boolean
// }) {
//   const feeFileCount = 25 // do not change this
//   const address = data.address // the receiver address
//   const inscriptionBalance = OUTPUT_VALUE // the balance in each inscription
//   const fileCount = data.fileCount // the fileCount
//   const fileSize = data.fileSize // the total size of all files
//   const contentTypeSize = data.contentTypeSize // the size of contentType
//   const feeRate = data.feeRate // the feeRate
//   const feeFileSize = data.fileSize // the total size of first 25 files
//   const devFee = data.devFee // the fee for developer

//   const balance = inscriptionBalance * fileCount

//   let addrSize = 25 + 1 // p2pkh
//   if (address.indexOf('bc1q') == 0 || address.indexOf('tb1q') == 0) {
//     addrSize = 22 + 1
//   } else if (address.indexOf('bc1p') == 0 || address.indexOf('tb1p') == 0) {
//     addrSize = 34 + 1
//   } else if (address.indexOf('2') == 0 || address.indexOf('3') == 0) {
//     addrSize = 23 + 1
//   }

//   const baseSize = 88
//   let networkSats = Math.ceil(
//     ((fileSize + contentTypeSize) / 4 + (baseSize + 8 + addrSize + 8 + 23)) *
//       feeRate
//   )
//   if (fileCount > 1) {
//     networkSats = Math.ceil(
//       ((fileSize + contentTypeSize) / 4 +
//         (baseSize +
//           8 +
//           addrSize +
//           (35 + 8) * (fileCount - 1) +
//           8 +
//           23 +
//           (baseSize + 8 + addrSize + 0.5) * (fileCount - 1))) *
//         feeRate
//     )
//   }
//   let networkSatsByFeeCount = Math.ceil(
//     ((feeFileSize + contentTypeSize) / 4 + (baseSize + 8 + addrSize + 8 + 23)) *
//       feeRate
//   )
//   if (fileCount > 1) {
//     networkSatsByFeeCount = Math.ceil(
//       ((feeFileSize + contentTypeSize * (feeFileCount / fileCount)) / 4 +
//         (baseSize +
//           8 +
//           addrSize +
//           (35 + 8) * (fileCount - 1) +
//           8 +
//           23 +
//           (baseSize + 8 + addrSize + 0.5) *
//             Math.min(fileCount - 1, feeFileCount - 1))) *
//         feeRate
//     )
//   }

//   const baseFee = 1999 * Math.min(fileCount, feeFileCount) // 1999 base fee for top 25 files
//   const floatFee = Math.ceil(networkSatsByFeeCount * 0.0499) // 4.99% extra miner fee for top 25 transations
//   const serviceFee = data.serviceFee ? Math.floor(baseFee + floatFee) : 0

//   const total = balance + networkSats + serviceFee
//   const truncatedTotal = Math.floor(total / 1000) * 1000 // truncate
//   const amount = truncatedTotal + devFee // add devFee at the end

//   return amount
// }

const imgHex =
  '524946465404000057454250565038580a000000100000005c00004a0000414c5048ba000000017f402008996281268888081ceb70388aad6d591ebcc79f800accfcba6628e22e0974e7908102bafd870c2470d717e7c37511d17f856ddb36d40349c7130026447a9c6e48444cb398003c77169e9f11893c7fccccf3e31da659149ed70ce9b0ceb116115d308bfed345ed760c88b6dbeb1d865958101581121dc430cb1354e1b8f2a173b39c7385fe00d93d9ee5d5043d1e2d80c9d598003c770d555d5f4d53557557ff091f93543abdba9a7c3aadbbfab77cfaacb66ba5030056503820740300001015009d012a5d004b003e81349547a52322213bb4e800a010096c00c4949884c7b5ff22fc20fd66eb43e34935bcc394bfe079a2ff15ec03cc03fc37f40e901e603ee03ddaffbbfeccfba7f400fd80f480f643f40bfe01ff23d35bf5dfe187fbdffa9fdb4c31ded4ffb3376bd2dc295e43c6beb26b36c607a39ba1c4c5a32bb7d397b6cdec51a43431c051979534b296765ca19be1ef886ec4e1119510c8220b66542a4b2f3cfdf0c7eecb29e23835c66000f7d8c1084a77158e0a24b327ae945b65b61783a6df733d767f0fd6c6e8c288ae0df79492645cfbbfff216df2cea8de095c8b3ee6311c40a5703baede39bfedcafffeeacb623e640e5d80d2298c9062915549df09b9ee78a6ee90a8666a964107d3e1e09ddbe8a090dd0a57ffe7f83c79d339c9f415f757a2c3bea3051dd4a94b3e8fd71576ba33d50f25205259b254deb08637966b2cd37a8c9da6b0ec4981db8f2514d42eedbff6e0ffff767e8bffa68c52654008033a074e293c24631101d37a40bd0e87b3acfcb9a7bafd141420422c45deff7a182e907b0ce0cfe45f95dffd04517e315b6246501555def48e0fffe35edad96902bb1af54da81c4668036b4e5dd327526ffa0bb66dfd51aac2d3de6fcd475c6b675a3eb32ce56b0cc5da44c75666b9af1ba1ef8be09cf0b7db9fb26b9549b0c3f7cd865517c6a20ebeb815aecefe13cd16c7cf2513d6dbd70386eada22f6a3ae5877f8d3438972a1f36cc5d5c444e706968d8c1d88004ff56e227f69532b7c7f5bfc6f27ebcacc987dc95cdf971bb3c1383bbd77ec3a60d6f4abf1f2e4253e604239e741877bda5683113d67d834a86d52fe3d1b0c6adf45a1172209a5b677cda2613bf8a32de7275225994c309eb3b12a5eb13a362a54042017b3107cf2513e37fa7183adf8a4a5f12429721b499e73108c9dc9aaee42aec147bb10bc12e23cfc00fc086aae44e40275e30a922b6d748ad410dd380632e1c3e8bc9f3caa40166719323352118e1055fa194b48c56a31922e0dd72936c03867dc143c6b07f730f3fae9916bb81778a546c808f521089df6d147b080143beff451566c341d450abd28a93f580e936fbc340fad9793548579c1420957edabe318a312a646e1feb9908e3d5bbd2a85b2ff9a292a07a69c78cd71728ca876a6b438ff9f7ababfca7d44833bf7ec627c63fd02784d483e656e2914f4a1ff7b6e8522ff7d345d94c16579271bef9b8c721ba710000000'

const imgBase64 =
  'data:image/webp;base64,UklGRpYDAABXRUJQVlA4IIoDAAAQGgCdASpWAGEAPnk2kkeko6GhOdpZAJAPCWkAFsx+Ov7B+KvhN/VcfF1N+9/j3+WPxN/RPyM4Cn9k3gjDP9l/Mjzgv4zkG74r1Bv7L/u/Rw/nft49z30L/2fcT/k/9B/43YR9AAeiBmTnpprW8t67dR9StkXi1e76nACZJFp6vvaDTp/zWpHH7m60fN1YhxplEXBecTpBRlTG7JM5bwSN6MM+Rtgn6PjCULVJ6l0eSg7bFQZ5+WmLOlz8ZFh6ZcgwNapoLFiXCZCMNUsvZXhVzB/6edmD++wAAP5n8WEVQkw6uYEsj10NvDDeLTwaK+UeVe9eOkfLWa35Dg8t6V4EbtCFF63LAj/pXPY01J3RQ8Xp/ga2Vf9V28gLZyMemHY4RnnqU/t0veJF3SKNdrKtfTtgLz+ssDt4IT0hK+cENvbhTk9rWkiSwBjU62GRmiPcMtSHEzrIjR2p3pPNXJr41X3+GQz57v9R/znRfbMXrRfiidfhvYAG8wWdXaVb3WxxMdWKc+aFIV25jcxgZdscJA6vC1b1P8OKUU1+2EtgN+OmG1zfAT05aD0WOS4+kOcgeIaj+LotdWDZgfnJEO4R3FE21hSnLyncebrwLopD1Fmhez+KNMlXYzBGOlORSZL4QS5bfEFvJcP/cOBca/zNgyjzMGqZ49no6etFjGnmzjyg47OnOZRmjMfNHEvm5uneH+QMSm/ft1wR7tJJ6X5I4Iukl/0I81xRqSYpFD3ERJgxO5fbZp2Bf7uNIcGSuymY8NZ+/vGeoIOf9RYMpHzEhbhZ9k7dUewEjM4mb90t784fKymUlxHYi/2xderwag8I0bzcgG3C51bpPZMvRxL78LvsxMEwPdTNslzbgD/S1NjEf/8bLbt//pwtc9x0YHbrDmtzAuzGVV+Etoq75PivXvh6AVy5LPb0tsKynMdxxKDLDO5BSTGT9MsPHbL8kDzvGL4BJvjTEazPhsSSDs57EKsq7P/r0CVP82l9yUs7gQuuAH+mpVeqDgaRMeN6gOUmz/6/bmn6tcvbFf5wWbue5odoMa+qQmIPCD/f0fEjtDKq+QqgebHe+Sr0giPYC/3I1GO3M4akU4qX6LOBqiAbkdFh5c5tq388HVSlhkknyy5VOx8OO9g35DqEdJ/+9igU0F3MVVYgh2RLWYEPkcRrxquEeGbFpIw3wtIDs/T65ZJAX8At8zgAAAA='
