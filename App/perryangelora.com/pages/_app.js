import Navbar from '../src/Navbar';
import '../styles/main.scss';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const { route } = useRouter();

  return (<>
    <Navbar />
    <AnimatePresence exitBeforeEnter>
      <Component {...pageProps} key={route} />
    </AnimatePresence>
  </>);
}

export default MyApp;
