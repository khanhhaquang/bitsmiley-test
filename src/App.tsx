import { Suspense } from 'react'

import { PageLoader } from '@/components/PageLoader'

import Routes from './App.routes'
import { BrowserRouter } from 'react-router-dom'
import { usePreloadResources } from './hooks/usePreloadResources'

const App: React.FC = () => {
  const { isLoading } = usePreloadResources()

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes />
      </Suspense>
    </BrowserRouter>
  )
}

export default App
