import { IoMdClose } from 'react-icons/io';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { wrap } from 'popmotion';
import Image from 'next/image';
import { useRouter } from 'next/router';
import setImageSize from './setImageSize.js';
import blurDataToBase64 from './blurDataToBase64.js';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const variants = {
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    transition: {
      duration: 1
    }

  },
  exit: (direction) => {
    return {
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 600, damping: 30 },
        opacity: { duration: 0.4 },
        duration: 1,
      }
    };
  }
};

export default function ImageDisplay({ images, closeModal }) {

  const controls = useAnimation();
  const router = useRouter();
  const initialPage = images.findIndex((e) => e.id === router.query.image);

  const [[page, direction], setPage] = useState([initialPage, 1]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  const imageIndex = wrap(0, images.length, page);

  const imageDimensions = setImageSize(images[imageIndex].ratio.h, images[imageIndex].ratio.w);
  const blurDataURL = blurDataToBase64(images[imageIndex].blurHash, images[imageIndex].ratio.w, images[imageIndex].ratio.h);
  console.log('blur-->:', blurDataURL);
  // An instance of it just works - not exactly sure why, ¯\_(ツ)_/¯
  // but this needs to be revisited.
  async function handleDragEnd(_, info) {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -150 || velocity < -500) {
      await controls.start({
        x: '-100%',
        opacity: 1,
        transition: {
          duration: 0.2, ease: [.25, .01, .53, 1]
        }
      });
      paginate(1);

    } else if (offset > 150 || velocity > 500) {
      await controls.start({
        x: '100%',
        opacity: 1,
        transition: {
          duration: 0.2, ease: [.25, .01, .53, 1]
        }
      });
      paginate(-1);
    }
  }

  function handleKeyDown(e) {
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');
    e.stopPropagation();
    switch (e.keyCode) {
      case 39:
        return nextBtn.click();
      case 37:
        return prevBtn.click();
      case 27:
        return closeModal();
      default:
        break;
    }
  };

  // Update query string on advance. 
  if (Object.keys(router.query).length !== 0 && router.query.image !== images[imageIndex].id) {
    router.push(`${router.pathname}?image=${images[imageIndex].id}`, undefined, { shallow: true });
  }

  return (
    <>
      <div className='modal-whole'>
        <button onClick={closeModal}><IoMdClose /></button>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            className="img-wrapper-div"
            custom={direction}
            variants={variants}
            initial="enter"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            animate={controls}
            onDragEnd={handleDragEnd}
            transition={{
              x: {
                type: 'tween',
                duration: 0.1,
                // ease: 'easeInOut'
              },


            }}
          >
            <div className='inner-image-wrap' style={{ width: imageDimensions.w, height: imageDimensions.h }}>
              <Image
                src={`/cms/images/${images[imageIndex].mainFileName}`}
                alt="none"
                height={imageDimensions.h}
                width={imageDimensions.w}
                blurDataURL={blurDataURL}
                placeholder="blur"
                layout='responsive'
                className='image-main'
              />
              <div className='image-text'><span className='name'>{images[imageIndex].name}</span> - {images[imageIndex].medAndSize}</div>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="next prev-next-btn" onClick={() => paginate(1)}>
          <IoIosArrowForward />
        </div>
        <div className="prev prev-next-btn" onClick={() => paginate(-1)}>
          <IoIosArrowBack />
        </div>
      </div>
    </>
  );
}
