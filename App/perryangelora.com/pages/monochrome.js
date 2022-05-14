import GalleryGuts from './../src/GalleryGuts';
import { motion } from 'framer-motion';
import { galleryVariant } from './../src/galleryVariants';
import jsonDoc from './../public/cms/cms.json';
import Head from 'next/head';


export default function Monochrome(){
  const monoJson = jsonDoc.filter((thumb) => thumb.gallery === 'monochrome');
  return (
    <>
      <Head>
        <meta name='title' content='Monochrome' key='monochromes-title'/>
        <meta name='description' content='Monochromatic artworks' key='monochromes-desc'/>
      </Head>
      <motion.div 
        initial={galleryVariant.galleryStart}
        animate={galleryVariant.galleryEnter}
        exit={galleryVariant.galleryExit}
        variants={galleryVariant}
      >
        <GalleryGuts galleryJSON={monoJson} />
      </motion.div>
    </>
  );
}