import ReactDOM from 'react-dom/client'

import App from './App.tsx'
import Providers from './Providers.tsx'
import './global.scss'
import './utils/i18n.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Providers>
    <App />
  </Providers>
)
