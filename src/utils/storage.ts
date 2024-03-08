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

export { clearStorage, setLocalStorage, deleteLocalStorage, getLocalStorage }
