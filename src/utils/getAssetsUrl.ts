export const getAssetUrl = (path: string) => {
  return new URL(path, import.meta.url).href
}

export const getFrameUrl = (
  frameName: string,
  picName: string | number,
  format: string = 'png'
) => {
  return new URL(
    `/src/assets/frames/${frameName}/${picName}.${format}`,
    import.meta.url
  ).href
}

export const getIllustrationUrl = (name: string, format: string = 'png') => {
  return new URL(`/src/assets/illustrations/${name}.${format}`, import.meta.url)
    .href
}

export const openUrl = (url: string) => {
  window.open(url, '_blank')
}

export const getSoundUrl = (name: string) => {
  return new URL(`/src/assets/sounds/${name}.mp3`, import.meta.url).href
}
