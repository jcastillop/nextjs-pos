import '@/styles/globals.css'
import { lightTheme } from '@/themes'
import { CssBaseline, ThemeProvider } from '@mui/material'
import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import { AuthProvider, FuelProvider, UiProvider } from '../context'
import { SessionProvider } from 'next-auth/react'
import { Alerta } from '@/components/ui'
import { initialReceptor } from '@/database/receptor'
import { initialComprobante } from '@/database/comprobante'

export default function App({ Component, pageProps }: AppProps) {
  return (

    <SWRConfig value={{
      //refreshInterval: 3000,
      fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
    }}>
      
      <SessionProvider>
        {/* <AuthProvider> */}
          <FuelProvider isLoaded={false} cart={[]} numberOfItems={0} subTotal={0} tax={0} total={0} receptor={initialReceptor} comprobante={initialComprobante}>
            <UiProvider>
              <ThemeProvider theme={ lightTheme }>
                <CssBaseline/>
                <Alerta/>
                <Component {...pageProps} />
              </ThemeProvider>
            </UiProvider>
          </FuelProvider>
        {/* </AuthProvider> */}
      </SessionProvider>
      
    </SWRConfig>


  )
}
