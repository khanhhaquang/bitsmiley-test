export const convertImageToHex = (path: string): Promise<string> =>
  fetch(path)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsArrayBuffer(blob)
        })
    )
    .then((res) => {
      const byteArray = new Uint8Array(res as ArrayBuffer)
      const hexArray = Array.from(byteArray, (byte) =>
        byte.toString(16).padStart(2, '0')
      )
      const hexString = hexArray.join('').toUpperCase()
      return hexString
    })

export const convertImageToBase64 = (path: string): Promise<string> =>
  fetch(path)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
    )
