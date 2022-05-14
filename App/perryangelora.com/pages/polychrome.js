import GalleryGuts from './../src/GalleryGuts';
import { motion } from 'framer-motion';
import { galleryVariant } from './../src/galleryVariants';
import jsonDoc from './../public/cms/cms.json';
import Head from 'next/head';



export default function Polychrome(){
  const polyJson = jsonDoc.filter((thumb) => thumb.gallery === 'polychrome');

  return (
    <>
      <Head>
        <meta name='title' content='Polychrome' key="polychromes-title"/>
        <meta name='description' content='Polychromatic artworks' key="polychromes-desc" />
      </Head>
      <motion.div
        initial={galleryVariant.galleryStart}
        animate={galleryVariant.galleryEnter}
        exit={galleryVariant.galleryExit}
        variants={galleryVariant}
      >
        <GalleryGuts galleryJSON={polyJson} />
      </motion.div>
    </>
  );
}