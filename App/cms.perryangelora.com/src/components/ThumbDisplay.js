import { useEffect, useState } from 'react';
import Image from 'next/image';
import {motion, AnimatePresence, AnimateSharedLayout, Reorder} from 'framer-motion';

export default function ThumbDisplay({thumbs, makeEdit, deleteEntry}) {
  const [thumbElements, setThumbElements] = useState([]);
  
  useEffect(() => {
    const parsedThumbs = JSON.parse(thumbs);
    if(parsedThumbs.length > 0) {
      setThumbElements(parsedThumbs);
    }
  }, [thumbs]);

  console.log(thumbElements);

  return (
    <div className='thumb-ul-wrapper'>{
      thumbElements.length === 0 ?
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
        
          <Reorder.Group axis='y' values={thumbElements} onReorder={setThumbElements} className='thumb-list'>
          
            {thumbElements.map((thumb) => (
              <Reorder.Item
                value={thumb}
                className='thumb-list-item' key={thumb.id}
              >
                <Image
                  src={`https://s3.amazonaws.com/perryangelora.com/cms/thumbs/${thumb.thumbFileName}`}
                  alt={`${thumb.name} thumbnail image`}
                  height={100}
                  width={100}
                />
                <div className='text-holder'>
                  <h3>{thumb.name}</h3>
                  <h4>{thumb.medAndSize}</h4>
                </div>
                <div className='button-wrapper'>
                  <button onClick={() => deleteEntry(thumb.id)}>Delete</button>
                  <button onClick={() => makeEdit(thumb.id, thumb.mainFileName, thumb.name, thumb.medAndSize, thumb.gallery, thumb.thumbXY, thumb.magnification)}>Edit</button>
                </div>
              </Reorder.Item>
            ))
            }
          </Reorder.Group>

        </>
    }</div>
  );
}