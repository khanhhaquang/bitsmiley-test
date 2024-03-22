export const getAssetUrl = (path: string) => {
  return new URL(path, import.meta.url).href
}

export const getFrameUrl = (
  frameName: string,
  picName: string | number,
  format: string = 'png'
) => {
  return getAssetUrl(`/src/assets/frames/${frameName}/${picName}.${format}`)
}

export const getIllustrationUrl = (name: string, format: string = 'png') => {
  return getAssetUrl(`/src/assets/illustrations/${name}.${format}`)
}

export const openUrl = (url: string) => {
  window.open(url, '_blank')
}
