import { IoMdClose } from 'react-icons/io';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { wrap } from 'popmotion';
import Image from 'next/image';
import { useRouter } from 'next/router';
import setImageSize from './setImageSize.js';

const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    };
  }
};


const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};


export default function ImageDisplay({ images, closeModal }) {
  const { query, router } = useRouter();
  const initialPage = images.findIndex((e) => e.id === query.image);

  const [[page, direction], setPage] = useState([initialPage, 0]);

  const imageIndex = wrap(0, images.length, page);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  const imageDimensions = setImageSize(images[imageIndex].ratio.h, images[imageIndex].ratio.w);

  return (
    <>
      <div className='modal-whole'>
        <button onClick={closeModal}><IoMdClose /></button>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            className="random-div"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
          >
            <Image
              src={`/cms/images/${images[imageIndex].mainFileName}`}
              alt="none"
              // layout='fill'
              height={imageDimensions.h}
              width={imageDimensions.w}
              // layout={'fill'} objectFit={'contain'}
                
            />
          </motion.div>
        </AnimatePresence>
        <div className="next" onClick={() => paginate(1)}>
          {'‣'}
        </div>
        <div className="prev" onClick={() => paginate(-1)}>
          {'‣'}
        </div>
      </div>
    </>
  );
}
