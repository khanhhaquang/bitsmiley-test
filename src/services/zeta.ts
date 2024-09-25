import { AxiosInstance } from 'axios'
import { Hash } from 'viem'

export interface InboundHashToCctxResponse {
  inboundHashToCctx: {
    inbound_hash: string
    cctx_index: string[]
  }
}

export interface CctxResponse {
  CrossChainTx: Cctx
}
export interface Cctx {
  creator: string
  index: Hash
  zeta_fees: string
  relayed_message: string
  cctx_status: {
    status:
      | 'PendingInbound'
      | 'PendingOutbound'
      | 'OutboundMined'
      | 'PendingRevert'
      | 'Reverted'
      | 'Aborted'
    status_message: string
    lastUpdate_timestamp: string
    isAbortRefunded: boolean
    created_timestamp: string
  }
}

export const ZetaService = (axiosInstance: AxiosInstance) => ({
  inboundHashToCctx: {
    key: 'zeta.inboundHashToCctx',
    call: (hash: string) =>
      axiosInstance
        .get<InboundHashToCctxResponse>(
          `/zeta-chain/crosschain/inTxHashToCctx/${hash}`
        )
        .then((data) => data.data)
  },
  getCctxDetail: {
    key: 'zeta.getCctxDetail',
    call: (txn: string) =>
      axiosInstance
        .get<CctxResponse>(`/zeta-chain/crosschain/cctx/${txn}`)
        .then((data) => data.data)
  }
})
