import { ReactNode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from '@/store/rootReducer'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ModalsContainer } from '@/components/Modal'
import { ToastsContainer } from '@/components/Toast'
import CustomWagmiProvider from '@/providers/CustomWagmiProvider'
import { CopyRightAndLinks } from '@/components/CopyRightAndLinks'

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
      <BrowserRouter>
        <CustomWagmiProvider>
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} position="bottom" />
            <ModalsContainer />
            <ToastsContainer />
            {children}
            <CopyRightAndLinks />
          </QueryClientProvider>
        </CustomWagmiProvider>
      </BrowserRouter>
    </ReduxProvider>
  )
}

export default Providers
