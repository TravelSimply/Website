import {CacheProvider} from '@emotion/react'
import {ThemeProvider, CssBaseline} from '@mui/material'
import theme from '../styles/theme'
import '../styles/globals.css'
import createCache from '@emotion/cache'
import axios from 'axios'

const clientSideEmotionCache = () => {
  return createCache({key: 'css'})
}

axios.defaults.baseURL = process.env.BASE_URL
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.withCredentials = true

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
