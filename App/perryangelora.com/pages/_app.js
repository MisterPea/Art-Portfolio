import Navbar from '../src/Navbar';
import '../styles/main.scss';

function MyApp({ Component, pageProps }) {
  return (<>
    <Navbar />
    <Component {...pageProps} />
  </>);
}

export default MyApp;
