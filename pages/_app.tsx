import { UiProvider,CartProvider, AuthProvider } from '@/context';
import '@/styles/globals.css'
import { lightTheme } from '@/themes'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { SessionProvider } from "next-auth/react"
import type { AppProps } from 'next/app'
import {SWRConfig}  from 'swr';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
    <SWRConfig value={{
       fetcher:(resource,init) => fetch(resource,init).then(res=>res.json())
    }}>
      <AuthProvider>
      <CartProvider>
      <UiProvider>
    
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
    </UiProvider>
    </CartProvider>
    </AuthProvider>
    </SWRConfig>
    </SessionProvider>
 
  )

}
 