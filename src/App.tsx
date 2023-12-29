import { Suspense } from 'react'

import { PageLoader } from '@/components/PageLoader'

import Routes from './App.routes'
import { usePreloadResources } from '@/hooks/usePreloadResources'
import { useFetchArticles } from '@/hooks/useFetchArticles'

const App: React.FC = () => {
  useFetchArticles()
  const { isLoading } = usePreloadResources()

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
