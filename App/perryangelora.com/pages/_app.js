import Navbar from '../src/Navbar';
import '../styles/main.scss';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import Link from 'next/link';

function MyApp({ Component, pageProps }) {
  const { route } = useRouter();
  const year = new Date().getFullYear();


  return (<>
    <div className='main-body'>
      <Navbar />
      <AnimatePresence exitBeforeEnter>
        <Component {...pageProps} key={route} />
      </AnimatePresence>
      <footer>
        <Link href='/about' >
          <a style={{ display: `${route === '/about' ? 'none':'block'}` }} className='about-bottom'>About</a>
        </Link>
        <div className='date'>{`©${year} Perry Angelora`}</div>
      </footer>
    </div>
  </>);
}

export default MyApp;
