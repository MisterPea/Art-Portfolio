import GalleryGuts from './../src/GalleryGuts';
import { motion } from 'framer-motion';
import { galleryVariant } from './../src/galleryVariants';
import jsonDoc from './../public/cms/cms.json';



export default function Polychrome(){
  const polyJson = jsonDoc.filter((thumb) => thumb.gallery === 'polychrome');

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