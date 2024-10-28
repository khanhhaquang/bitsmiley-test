export const DOMAIN_URL: {
  API: string
} = {
  API: import.meta.env.VITE_API_DOMAIN
}

export const LOCAL_STORAGE_KEYS = {
  PLAY_MUSIC: 'play_music',
  CONFIRMED_DISCLAIMER: 'confirmed_disclaimer',
  TXIDS: 'txids',
  LOGIN_TYPE: 'login_type',
  BTC_LOGIN_TYPE: 'native_btc_login_type',
  ZETA_PROCESSING_STEP: 'zeta_processing_step',
  ZETA_PROCESSING_TXN: 'zeta_processing_txn',
  ZETA_PROCESSING_RAW_BTC_TXN: 'zeta_processing_btc_raw_txn',
  TOKEN: 'token'
}
