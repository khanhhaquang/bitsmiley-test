export const DOMAIN_URL: {
  API: string
  MEMPOOL_API: string
} = {
  API: import.meta.env.VITE_API_DOMAIN,
  MEMPOOL_API: import.meta.env.VITE_MEMPOOL_DOMAIN
}

export const LOCAL_STORAGE_KEYS = {
  LOGIN_TYPE: 'login_type',
  PLAY_MUSIC: 'play_music',
  CONFIRMED: 'confirmed',
  CONFIRMED_MINTED: 'confirm_minted'
}
