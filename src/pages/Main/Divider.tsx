import { useWindowSize } from '@/hooks/useWindowSize'
import { cn } from '@/utils/cn'

export const Divider: React.FC<{ title: string; className?: string }> = ({
  title,
  className
}) => {
  const { width } = useWindowSize()
  return (
    <div
      style={{
        scale: `${width >= 1920 ? 100 : (1920 * 100) / width}%`,
        padding: `0 ${width / 8}px`
      }}
      className={cn('my-[200px] flex items-center justify-center', className)}>
      <div
        className="text-4xl font-bold"
        style={{
          fontSize: `${(width / 1920) * 36}px`
        }}>
        +
      </div>
      <div
        className="flex flex-1 items-center overflow-hidden text-4xl"
        style={{
          fontSize: `${(width / 1920) * 36}px`
        }}>
        {Array(30)
          .fill(1)
          .map((_, idx) => (
            <div className="font-bold" key={idx}>
              -
            </div>
          ))}
      </div>
      <div
        className="px-6 py-2.5 text-4xl"
        style={{
          fontSize: `${(width / 1920) * 36}px`
        }}>
        {title}
      </div>
      <div
        className="flex flex-1 items-center overflow-hidden text-4xl"
        style={{
          fontSize: `${(width / 1920) * 36}px`
        }}>
        {Array(30)
          .fill(1)
          .map((_, idx) => (
            <div className="font-bold" key={idx}>
              -
            </div>
          ))}
      </div>
      <div
        className="text-4xl font-bold"
        style={{
          fontSize: `${(width / 1920) * 36}px`
        }}>
        +
      </div>
    </div>
  )
}
