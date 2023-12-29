import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { BrowserRouter } from 'react-router-dom'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const queryRetry = (count: number, { response }: any): boolean =>
  count < 3 && response?.status !== 401 && response?.status !== 404
const queryRetryDelay = (attemptTimes: number) =>
  Math.min(1000 * 2 ** attemptTimes, 30000)
const queryRetryConfig = {
  retry: queryRetry,
  retryDelay: queryRetryDelay
}

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: queryRetryConfig,
    queries: queryRetryConfig
  }
})

type TProps = {
  children: ReactNode
}

const Providers: React.FC<TProps> = (props: TProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen position="top-left" />
      <BrowserRouter>{props.children}</BrowserRouter>
    </QueryClientProvider>
  )
}

export default Providers