import React from 'react'
import Document, {Html, Head, Main, NextScript} from 'next/document'
import createEmotionServer from '@emotion/server/create-instance'
import createCache from '@emotion/cache'

export default class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                    />
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                    <link href="https://fonts.googleapis.com/css2?family=Bitter&display=swap" rel="stylesheet" />
                    <link href="https://fonts.googleapis.com/css2?family=Lemon&display=swap" rel="stylesheet" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

MyDocument.getInitialProps = async (ctx) => {

    const originalRenderPage = ctx.renderPage

    const cache = createCache({key: 'css'})
    const {extractCriticalToChunks} = createEmotionServer(cache)

    ctx.renderPage = () => {
        return originalRenderPage({
            enhanceApp: (App:any) => function enhanceApp(props) {
                return <App emotionCache={cache} {...props} />
            }
        })
    }

    const initialProps = await Document.getInitialProps(ctx)

    const emotionStyles = extractCriticalToChunks(initialProps.html)
    const emotionStylesTags = emotionStyles.styles.map(style => (
        <style
            data-emotion={`${style.key} ${style.ids.join(' ')}`}
            key={style.key}
            dangerouslySetInnerHTML={{__html: style.css}}
        />
    ))

    return {
        ...initialProps,
        styles: [
            ...React.Children.toArray(initialProps.styles),
            ...emotionStylesTags
        ]
    }
}