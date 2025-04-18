'use client'
import { XRProvider } from '@react-three/xr'

function MyApp({ Component, pageProps }) {
  return (
    <XRProvider>
      <Component {...pageProps} />
    </XRProvider>
  )
}

export default MyApp