import { axios } from '@/config/axios'

const ZETA_URL =
  'https://zetachain-athens.blockpi.network/lcd/v1/public/zeta-chain/crosschain/inboundHashToCctx'

interface CctxResponse {
  inboundHashToCctx: Cctx
}
interface Cctx {
  inbound_hash: string
  cctx_index: string[]
}

export const ZetaService = {
  inboundHashToCctx: {
    key: 'zeta.inboundHashToCctx',
    call: (hash: string) => axios.get<CctxResponse>(`${ZETA_URL}/${hash}`)
  }
}
