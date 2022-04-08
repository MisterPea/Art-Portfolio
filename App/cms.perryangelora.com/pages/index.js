import Head from 'next/head'
import Image from 'next/image'
import Navbar from '../components/Navbar'
import MainBody from '../components/MainBody'

export default function Home() {
  return (
   <>
     <Head>
       <title>perryangelora.com cms</title>
     </Head>
     <Navbar />
     <MainBody />
   </>
  )
}
