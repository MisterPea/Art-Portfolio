import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import ReorderComponent from './ReorderComponent';
import { useSession } from 'next-auth/react';

export default function ThumbDisplay({ thumbs, makeEdit, deleteEntry }) {
  const [allThumbElements, setAllThumbElements] = useState([]);
  const [monoThumbElements, setMonoThumbElements] = useState([]);
  const [polyThumbElements, setPolyThumbElements] = useState([]);
  const [currentGallery, setCurrentGallery] = useState('all');
  const  authData = useSession();
  console.log(authData)

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
          return { ...monoThumbElements[mono_i], order:`m${i}` };
        
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
          return { ...polyThumbElements[poly_i], order:`p${i}` };
        
        } else {
          return elem;
        }
      });
      setAllThumbElements(newAllThumbs);
    }
  }, [polyThumbElements]);

  useEffect(() => {
    const allSelector = document.getElementById('all');
    if(allSelector) {
      allSelector.classList.add('active');
    }
  }, []);

  function handleChangeGallery(e) {
    const prevGal = document.getElementById(currentGallery);
    prevGal.classList.remove('active');

    setCurrentGallery(e.target.id);
    const newGal = document.getElementById(e.target.id);
    newGal.classList.add('active');
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
              <li className='nav-li' id='all'>All</li>
              <li className='nav-li' id='mono'>Mono</li>
              <li className='nav-li' id='poly'>Poly</li>
            </ul>

          </div>
          <p className='drag-instruct'>Drag to Re-order</p>
          <AnimatePresence>
            {currentGallery === 'all' && <ReorderComponent values={allThumbElements} onReorder={setAllThumbElements} makeEdit={makeEdit} deleteEntry={deleteEntry} authData={authData} /> }
            {currentGallery === 'mono' && <ReorderComponent values={monoThumbElements} onReorder={setMonoThumbElements} makeEdit={makeEdit} deleteEntry={deleteEntry} authData={authData} /> }
            {currentGallery === 'poly' && <ReorderComponent values={polyThumbElements} onReorder={setPolyThumbElements} makeEdit={makeEdit} deleteEntry={deleteEntry} authData={authData} /> }
          </AnimatePresence>
        </>
    }</div>
  );
}