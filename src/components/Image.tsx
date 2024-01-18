export const Image: React.FC<{
  src: string
  className?: string
  style?: React.CSSProperties
}> = ({ src, style, className }) => {
  return <img alt="..." src={src} style={style} className={className} />
}
