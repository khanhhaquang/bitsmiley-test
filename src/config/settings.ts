export const DOMAIN_URL: {
  API: string
  UNISATE_API: string
  MEMPOOL_API: string
} = {
  API: import.meta.env.VITE_API_DOMAIN,
  UNISATE_API: import.meta.env.PROD
    ? import.meta.env.VITE_UNISATE_MAIN_API_DOMAIN
    : import.meta.env.VITE_UNISATE_TEST_API_DOMAIN,
  MEMPOOL_API: import.meta.env.PROD
    ? import.meta.env.VITE_MEMPOOL_DOMAIN
    : import.meta.env.VITE_MEMPOOL_TEST_DOMAIN
}

export const UNISAT_API_KEY = import.meta.env.VITE_UNISATE_API_KEY

export const LOCAL_STORAGE_KEYS = {
  LOGIN_TYPE: 'login_type',
  ENABLE_INSCRIBE: 'enable_inscribe',
  PLAY_MUSIC: 'play_music'
}
