export default function getImageUrl(path: string) {
  return new URL(path, import.meta.url).href
}

export const getFrameUrl = (frameName: string, picName: string | number) => {
  return new URL(
    `/src/assets/frames/${frameName}/${picName}.png`,
    import.meta.url
  ).href
}

export const getIllustrationUrl = (name: string) => {
  return new URL(`/src/assets/illustrations/${name}.png`, import.meta.url).href
}
