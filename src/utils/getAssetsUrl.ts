export const getAssetUrl = (path: string) => {
  return new URL(path, import.meta.url).href
}

export const getFrameUrl = (
  frameName: string,
  picName: string | number,
  format?: string
) => {
  return new URL(
    `/src/assets/frames/${frameName}/${picName}.${format || 'png'}`,
    import.meta.url
  ).href
}

export const getIllustrationUrl = (name: string, format?: string) => {
  return new URL(
    `/src/assets/illustrations/${name}.${format || 'png'}`,
    import.meta.url
  ).href
}
