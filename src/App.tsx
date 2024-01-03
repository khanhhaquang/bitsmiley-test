import { Suspense } from 'react'

import { PageLoader } from '@/components/PageLoader'

import Routes from './App.routes'
import { usePreloadResources } from '@/hooks/usePreloadResources'
import { useFetchArticles } from '@/hooks/useFetchArticles'
import { useIsWalletUnlocked } from './hooks/useIsWalletUnlocked'

const App: React.FC = () => {
  const { isLoading: isLoadingArticles } = useFetchArticles()
  const { isLoading: isCheckingWallet } = useIsWalletUnlocked()
  const { isLoading: isLoadingImages } = usePreloadResources()

  const isLoading = isLoadingArticles || isCheckingWallet || isLoadingImages

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes />
    </Suspense>
  )
}

export default App
