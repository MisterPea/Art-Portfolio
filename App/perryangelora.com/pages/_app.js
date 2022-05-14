import Navbar from './../src/Navbar';
import './../styles/main.scss';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  const { route } = useRouter();
  const year = new Date().getFullYear();

  return (<>
    <Head>
      <title>Perry Angelora - Artworks</title>
      <meta charSet='utf-8'/>
      <meta property='description' content='The Artwork of Perry Angelora :: Painter/Printmaker/Draftsman'/>
      <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
    </Head>
    <div className='main-body'>
      <Navbar />
      <AnimatePresence exitBeforeEnter>
        <Component {...pageProps} key={route} />
      </AnimatePresence>
      <footer>
        <Link href='/about' >
          <a className={`about-bottom ${route === '/about' ? 'active':''}`}>About</a>
        </Link>
        <div className='date'>{`©${year} Perry Angelora`}</div>
      </footer>
    </div>
  </>);
}

export default MyApp;
