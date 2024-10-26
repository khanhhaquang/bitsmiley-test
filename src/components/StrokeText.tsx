import { cn } from '@/utils/cn'

const StrokeText: React.FC<{
  children: string|number
  color: string
  strokeColor: string
  strokeWidth: number
  className?: string
}> = ({ children, color, strokeColor, strokeWidth, className }) => {
  return (
    <div
      className={cn('relative', className)}
      style={{
        color: color,
        WebkitTextStrokeColor: strokeColor,
        WebkitTextStrokeWidth: `${strokeWidth}px`,
      }}>
      <div
        style={{
          position: 'absolute',
          color: color,
          WebkitTextStrokeWidth: 0
        }}>
        {children}
      </div>
      {children}
    </div>
  )
}

export default StrokeText
