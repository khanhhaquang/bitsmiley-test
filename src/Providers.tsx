import { ReactNode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from '@/store/rootReducer'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ModalsContainer } from '@/components/Modal'
import { ToastsContainer } from '@/components/Toast'
import CustomWagmiProvider from '@/providers/CustomWagmiProvider'

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
      <CustomWagmiProvider>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} position="bottom" />
          <BrowserRouter>
            <ModalsContainer />
            <ToastsContainer />
            {children}
          </BrowserRouter>
        </QueryClientProvider>
      </CustomWagmiProvider>
    </ReduxProvider>
  )
}

export default Providers
