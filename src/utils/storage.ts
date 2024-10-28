import { Address } from 'viem'

import { LOCAL_STORAGE_KEYS } from '@/config/settings'

const setLocalStorage = (key: string, data: string) => {
  localStorage.setItem(key, data)
}

const getLocalStorage = (key: string) => {
  return localStorage.getItem(key)
}

const deleteLocalStorage = (key: string) => {
  return localStorage.removeItem(key)
}

const clearStorage = () => {
  const persistKeys = [LOCAL_STORAGE_KEYS.PLAY_MUSIC]
  Object.values(LOCAL_STORAGE_KEYS)
    .filter((key) => !persistKeys.includes(key))
    .forEach((key) => localStorage.removeItem(key))
}

export const parseCachedToken = () => {
  const result = getLocalStorage(LOCAL_STORAGE_KEYS.TOKEN)?.split('-')
  return { address: result?.[0], token: result?.[1] }
}

export const setCachedToken = (address: Address, token: string) => {
  setLocalStorage(LOCAL_STORAGE_KEYS.TOKEN, `${address}-${token}`)
}

export { clearStorage, setLocalStorage, deleteLocalStorage, getLocalStorage }
