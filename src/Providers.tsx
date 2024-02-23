import { ReactNode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import store from '@/store/rootReducer'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ModalsContainer } from '@/components/Modal'
import { config } from '@/config/wagmi'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false
    }
  }
})

const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ReduxProvider store={store}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} position="bottom" />
          <BrowserRouter>
            <ModalsContainer />
            {children}
          </BrowserRouter>
        </QueryClientProvider>
      </WagmiProvider>
    </ReduxProvider>
  )
}

export default Providers
