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
  localStorage.clear()
}

export { clearStorage, setLocalStorage, deleteLocalStorage, getLocalStorage }
