export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative aspect-square w-1/6 overflow-hidden rounded-[50%] bg-black">
        <span className="absolute h-full w-full animate-spin rounded-[50%] bg-gradient-to-r from-green to-black " />
        <div className="absolute left-1/2 top-1/2 flex h-3/4 w-3/4 translate-x-[-50%] translate-y-[-50%] items-center justify-center rounded-[50%] bg-black"></div>
      </div>
    </div>
  )
}
