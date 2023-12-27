export const Image: React.FC<{
  src: string
  className?: string
  style?: React.CSSProperties
}> = ({ src, style, className }) => {
  return (
    <img
      rel="preload"
      alt="picture"
      src={src}
      style={style}
      className={className}
    />
  )
}
