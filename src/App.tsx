import { Suspense } from 'react'

import Routes from './App.routes'

const App: React.FC = () => {
  return (
    <Suspense fallback="...">
      <Routes />
    </Suspense>
  )
}

export default App
