import Head from 'next/head';
import Image from 'next/image';
import Navbar from '../src/Navbar';
import { useRouter } from 'next/router';
import { useEffect } from 'react';


export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push('/monochrome', undefined, { shallow: true });
  });

  return (
    <div />
  );
}
