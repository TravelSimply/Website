import {CacheProvider} from '@emotion/react'
import {ThemeProvider, CssBaseline} from '@mui/material'
import theme from '../styles/theme'
import '../styles/globals.css'
import createCache from '@emotion/cache'

const clientSideEmotionCache = () => {
  return createCache({key: 'css'})
}

function MyApp({ Component, pageProps, emotionCache }) {

  const cache = emotionCache || clientSideEmotionCache()

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  )
}

export default MyApp
