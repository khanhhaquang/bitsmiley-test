type ImageProps = React.ImgHTMLAttributes<HTMLImageElement>

export const Image: React.FC<ImageProps> = (props) => {
  return <img {...props} />
}

export default Image
