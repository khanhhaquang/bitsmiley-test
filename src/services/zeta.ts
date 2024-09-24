import { AxiosInstance } from 'axios'

interface CctxResponse {
  inboundHashToCctx: Cctx
}
interface Cctx {
  inbound_hash: string
  cctx_index: string[]
}

export const ZetaService = (axiosInstance: AxiosInstance) => ({
  inboundHashToCctx: {
    key: 'zeta.inboundHashToCctx',
    call: (hash: string) =>
      axiosInstance.get<CctxResponse>(
        `/zeta-chain/crosschain/inTxHashToCctx/${hash}`
      )
  }
})
