import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

const BitUsd: React.FC = () => {
  return (
    <Suspense fallback="...">
      <Outlet />
    </Suspense>
  )
}

export default BitUsd
