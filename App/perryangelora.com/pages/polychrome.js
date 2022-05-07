import GalleryGuts from '../src/galleryGuts';
import { motion } from 'framer-motion';
import { galleryVariant } from '../src/galleryVariants';

export async function getStaticProps(){
  const res = await fetch('https://s3.amazonaws.com/perryangelora.com/cms/cms.json');
  const jsonDoc = await res.json();
  const polyJson = await jsonDoc.filter((thumb) => thumb.gallery === 'polychrome');
  return {
    props: {
      polyJson
    }
  };
}

export default function Polychrome({ polyJson }){
  return (
    <motion.div
      initial={galleryVariant.galleryStart}
      animate={galleryVariant.galleryEnter}
      exit={galleryVariant.galleryExit}
      variants={galleryVariant}
    >
      <GalleryGuts galleryJSON={polyJson} />
    </motion.div>
  );
}