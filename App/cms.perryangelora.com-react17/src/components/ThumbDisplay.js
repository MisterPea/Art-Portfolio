import { useEffect, useState } from 'react';
import { AnimatePresence} from 'framer-motion';
import ReorderComponent from './ReorderComponent';

export default function ThumbDisplay({thumbs, makeEdit, deleteEntry}) {
  const [allThumbElements, setAllThumbElements] = useState([]);
  const [monoThumbElements, setMonoThumbElements] = useState([]);
  const [polyThumbElements, setPolyThumbElements] = useState([]);
  const [currentGallery, setCurrentGallery] = useState('all');

  useEffect(() => {
    const parsedThumbs = JSON.parse(thumbs);
    if(parsedThumbs.length > 0) {
      setAllThumbElements(parsedThumbs);
      setMonoThumbElements(parsedThumbs.filter((e) => e.gallery === 'mono'));
      setPolyThumbElements(parsedThumbs.filter((e) => e.gallery === 'poly'));
    }
  }, [thumbs]);

  useEffect(() => {
    if (monoThumbElements.length > 0 && currentGallery === 'mono') {
      let mono_i = -1;
      const newAllThumbs = allThumbElements.map((elem, i) => {
        if(elem.gallery[0] === 'm') {
          mono_i += 1;
          return {...monoThumbElements[mono_i], order:`m${i}`};
        
        } else {
          return elem;
        }
      });
      setAllThumbElements(newAllThumbs);
    }
  }, [monoThumbElements]);

  useEffect(() => {
    if (polyThumbElements.length > 0 && currentGallery === 'poly') {
      let poly_i = -1;
      const newAllThumbs = allThumbElements.map((elem, i) => {
        if(elem.gallery[0] === 'p') {
          poly_i += 1;
          return {...polyThumbElements[poly_i], order:`p${i}`};
        
        } else {
          return elem;
        }
      });
      setAllThumbElements(newAllThumbs);
    }
  }, [polyThumbElements]);

  function handleChangeGallery(e) {
    setCurrentGallery(e.target.id);
  }

  useEffect(() => {
    if(currentGallery === 'all') {
      setMonoThumbElements(allThumbElements.filter((e) => e.gallery === 'mono'));
      setPolyThumbElements(allThumbElements.filter((e) => e.gallery === 'poly'));
    }
  }, [allThumbElements]);

  return (
    <div className='thumb-ul-wrapper'>{
      allThumbElements.length === 0 ?
        <h2 className='empty-list'>{"Looks like there's nothing here"}</h2> 
        :
        <>
          <div className='thumb-nav'>
            <ul onClick={handleChangeGallery}>
              <li id='all'>All</li>
              <li id='mono'>Mono</li>
              <li id='poly'>Poly</li>
            </ul>
          </div>
          <AnimatePresence>
            {currentGallery === 'all' && <ReorderComponent values={allThumbElements} onReorder={setAllThumbElements} makeEdit={makeEdit} deleteEntry={deleteEntry}/> }
            {currentGallery === 'mono' && <ReorderComponent values={monoThumbElements} onReorder={setMonoThumbElements} makeEdit={makeEdit} deleteEntry={deleteEntry}/> }
            {currentGallery === 'poly' && <ReorderComponent values={polyThumbElements} onReorder={setPolyThumbElements} makeEdit={makeEdit} deleteEntry={deleteEntry}/> }
          </AnimatePresence>
        </>
    }</div>
  );
}