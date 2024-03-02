export const DOMAIN_URL: {
  API: string
} = {
  API: import.meta.env.VITE_API_DOMAIN
}

export const LOCAL_STORAGE_KEYS = {
  PLAY_MUSIC: 'play_music',
  CONFIRMED_DISCLAIMER: 'confirmed_disclaimer',
  TXIDS: 'txids',
  NETWORKINFO: 'NETWORKINFO'
}

export const commonParam = {
  BTC: '0xe98e2830be1a7e4156d656a7505e65d08c67660dc618072422e9c78053c261e9',
  safeRate: 50 //50% -50* 10000000
}
