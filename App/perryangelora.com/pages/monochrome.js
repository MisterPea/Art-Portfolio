import GalleryGuts from '../src/galleryGuts';
import { motion } from 'framer-motion';
import { galleryVariant } from '../src/galleryVariants';

export async function getStaticProps(){
  const res = await fetch('https://s3.amazonaws.com/perryangelora.com/cms/cms.json');
  const jsonDoc = await res.json();
  const monoJson = await jsonDoc.filter((thumb) => thumb.gallery === 'monochrome');
  return {
    props: {
      monoJson
    }
  };
}

export default function Monochrome({ monoJson }){
  return (
    <motion.div 
      initial={galleryVariant.galleryStart}
      animate={galleryVariant.galleryEnter}
      exit={galleryVariant.galleryExit}
      variants={galleryVariant}
    >
      <GalleryGuts galleryJSON={monoJson} />
    </motion.div>
  );
}