import '../styles/main.scss';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps }) {
  return ( 
    <>
      <Head>
        <title>perryangelora.com cms</title> 
        <meta property='og:title' content='Perry Angelora - Painter :: Printmaker - CMS' key="title" />
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1, maximum-scale=1 viewport-fit=cover" />

      </Head>
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>);
}

export default MyApp;
