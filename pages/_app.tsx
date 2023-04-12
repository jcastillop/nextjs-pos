import '@/styles/globals.css'
import { lightTheme } from '@/themes'
import { CssBaseline, ThemeProvider } from '@mui/material'
import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import { FuelProvider } from '../context'

export default function App({ Component, pageProps }: AppProps) {
  return (

    <SWRConfig value={{
      //refreshInterval: 3000,
      fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
    }}>
      <FuelProvider isLoaded={false}>
        <ThemeProvider theme={ lightTheme }>
          <CssBaseline/>
          <Component {...pageProps} />
        </ThemeProvider>
      </FuelProvider>
    </SWRConfig>


  )
}
