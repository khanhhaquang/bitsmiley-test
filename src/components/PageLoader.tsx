import { LoadingSpinner } from '@/components/LoadingSpinner'

export const PageLoader = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <LoadingSpinner />
    </div>
  )
}
