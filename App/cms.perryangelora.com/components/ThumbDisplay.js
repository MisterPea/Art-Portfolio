import { useEffect, useState } from 'react';
import Image from 'next/image';
import {motion, AnimatePresence, AnimateSharedLayout} from 'framer-motion';

export default function ThumbDisplay({thumbs, makeEdit, deleteEntry}) {
  

  return (
    <div className='thumb-ul-wrapper'>{
      JSON.parse(thumbs).length === 0 ?
        <h2 className='empty-list'>{"Looks like there's nothing here"}</h2> 

        :
        <>
          <div className='thumb-nav'>
            <ul>
              <li>All</li>
              <li>Mono</li>
              <li>Poly</li>
            </ul>
          </div>
          <AnimateSharedLayout>
            <motion.ul layout className='thumb-list'>
          
              {JSON.parse(thumbs).map(({id, name, medAndSize, thumbFileName, mainFileName, gallery, thumbXY, magnification}) => (
                <motion.li
                  layout
                  className='thumb-list-item' key={id}
                >
                  <Image
                    src={`https://s3.amazonaws.com/perryangelora.com/cms/thumbs/${thumbFileName}`}
                    alt={`${name} thumbnail image`}
                    height={100}
                    width={100}
                  />
                  <div className='text-holder'>
                    <h3>{name}</h3>
                    <h4>{medAndSize}</h4>
                  </div>
                  <div className='button-wrapper'>
                    <button onClick={() => deleteEntry(id)}>Delete</button>
                    <button onClick={() => makeEdit(id, mainFileName, name, medAndSize, gallery, thumbXY, magnification)}>Edit</button>
                  </div>
                </motion.li>
              ))
              }
            </motion.ul>
          </AnimateSharedLayout> 
        </>
    }</div>
  );
}