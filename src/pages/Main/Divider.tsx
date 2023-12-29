import { cn } from "@/utils/cn";

export const Divider: React.FC<{ title: string; className?: string }> = ({
  title,
  className
}) => {
  return (
    <div
      className={cn(
        'my-[200px] flex cursor-default items-center justify-center px-[12%] py-2.5',
        className
      )}>
      <div className="text-5xl font-bold">+</div>
      <div className="flex flex-1 items-center overflow-hidden text-5xl">
        {Array(30)
          .fill(1)
          .map((_, idx) => (
            <div className="font-bold" key={idx}>
              -
            </div>
          ))}
      </div>
      <span className="px-6 text-5xl">{title}</span>
      <div className="flex flex-1 items-center overflow-hidden">
        {Array(30)
          .fill(1)
          .map((_, idx) => (
            <div className="text-5xl font-bold" key={idx}>
              -
            </div>
          ))}
      </div>
      <div className="text-5xl font-bold">+</div>
    </div>
  )
}
