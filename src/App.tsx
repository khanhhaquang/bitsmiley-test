import { Suspense } from 'react'

import { PageLoader } from '@/components/PageLoader'

import Routes from './App.routes'
import { BrowserRouter } from 'react-router-dom'

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes />
      </Suspense>
    </BrowserRouter>
  )
}

export default App
