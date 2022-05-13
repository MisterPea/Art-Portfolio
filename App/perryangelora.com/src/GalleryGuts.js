import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import ImageDisplay from './ImageDisplay';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Component to render thumbnail images. The basic idea is on thumbnail click we
 * push a query string of the main image id. We also set state to open the modal.
 * The opening of the modal is tied to a useEffect hook, so if the link is visited
 * with the query string pre-populated, it'll open the modal and subsequently the main image.
 * @param {Object[]} galleryJSON Return from getStaticProps
 * @return {JSX} Returns a JSX component
 */
export default function GalleryGuts({ galleryJSON }){
  const mainBody = useRef(undefined);
  const [mainImages, setMainImages] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    mainBody.current = document.querySelector(':root');
  }, []);

  useEffect(() => {
    const queryLength = Object.keys(router.query);
    if(queryLength.length > 0 && !openModal ){
      launchModal();
    }
  }, [router.query]);

  useEffect(() => {
    if(galleryJSON.length > 0) {
      const images = [];
      for(let i = 0; i < galleryJSON.length; i += 1) {
        const { id, name, ratio, medAndSize, blurHash, mainFileName } = galleryJSON[i];
        images.push({ id, name, ratio, medAndSize, blurHash, mainFileName });
      }
      setMainImages(images);
    }
  }, [galleryJSON]);
  
  function viewImagePath(id){
    router.push(`${router.pathname}?image=${id}`, undefined, { shallow: true });
  }

  function closeModal() {
    setOpenModal(false);
    router.push(router.pathname, undefined, { shallow: true });
    mainBody.current.classList.remove('modal-open');
  }

  function launchModal(){
    setOpenModal(true);
    mainBody.current.classList.add('modal-open');
  }

  const modalAnimation = {
    open: {
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
    closed: {
      opacity: 0,
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };


  return (
    <>
      <ul className='gallery-ul'>{
        galleryJSON.map((elem ) => (
          <li
            className="gallery-item"
            key={elem.id}
            onClick={() => viewImagePath(elem.id)}
          >
            <Image 
              src={`/cms/thumbs/${elem.thumbFileName}`}
              height={200}
              width={200}
              blurDataURL={elem.blurDataThumb}
              placeholder='blur'
              alt={`${elem.name} - ${elem.medAndSize}}`}
            />
          </li>
        ))
      }</ul>
      <AnimatePresence>
        {openModal && 
          <motion.div
            className='gallery-container'
            variants={modalAnimation}
            initial="closed"
            exit="exit"
            animate={openModal ? 'open': 'closed'}
          >
            <ImageDisplay images={mainImages} closeModal={closeModal}/>
          </motion.div>}
      </AnimatePresence>
    </>
  );
}