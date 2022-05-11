import { useEffect, useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import ReorderComponent from './ReorderComponent';
import { useSession } from 'next-auth/react';
import usePropagateReorder from '../hooks/usePropagateReorder';
import pushUpdateOrder from './pushUpdateOrder';

export default function ThumbDisplay({ thumbs, makeEdit, deleteEntry }) {
  const [allThumbElements, setAllThumbElements] = useState([]);
  const [monoThumbElements, setMonoThumbElements] = useState([]);
  const [polyThumbElements, setPolyThumbElements] = useState([]);
  const [currentGallery, setCurrentGallery] = useState('all');
  const prevThumbs = useRef([]);
  const authData = useSession();
  
  useEffect(() => {
    const parsedThumbs = JSON.parse(thumbs);
    if(parsedThumbs.length > 0) {
      setAllThumbElements(parsedThumbs);
      prevThumbs.current = parsedThumbs;
      setMonoThumbElements(parsedThumbs.filter((e) => e.gallery === 'monochrome'));
      setPolyThumbElements(parsedThumbs.filter((e) => e.gallery === 'polychrome'));
    }
  }, [thumbs]);

  useEffect(() => {
    const allSelector = document.getElementById('all');
    if(allSelector) {
      allSelector.classList.add('active');
    }

    window.addEventListener('beforeunload', writeJson);
    return () => {
      window.removeEventListener('beforeunload', writeJson);
    };
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(writeJson, 3000);
    
    return () => {
      clearTimeout(timeout);
    };

  }, [allThumbElements]);
  /**
   * These two hooks handle the renumbering that happens upon reordering.
   * So when individual galleries are reordered, changes are propagated to the main
   * group of thumbs.
   */
  usePropagateReorder(monoThumbElements, allThumbElements, setAllThumbElements, currentGallery, 'monochrome');
  usePropagateReorder(polyThumbElements, allThumbElements, setAllThumbElements, currentGallery, 'polychrome');

  function writeJson() {
    // pull out order numbers and compare
    const prevOrder = prevThumbs.current.map((elem) => elem.order).join('');
    const currOrder = allThumbElements.map((elem) => elem.order).join('');

    const compareStates = prevOrder === currOrder;
    if(!compareStates && authData.status === 'authenticated') {
      pushUpdateOrder(allThumbElements, prevThumbs);
    }
  };

  function handleChangeGallery(e) {
    const prevGal = document.getElementById(currentGallery);
    prevGal.classList.remove('active');

    setCurrentGallery(e.target.id);
    const newGal = document.getElementById(e.target.id);
    newGal.classList.add('active');
  }

  useEffect(() => {
    if(currentGallery === 'all') {
      setMonoThumbElements(allThumbElements.filter((e) => e.gallery === 'monochrome'));
      setPolyThumbElements(allThumbElements.filter((e) => e.gallery === 'polychrome'));
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
              <li className='nav-li active' id='all'>All</li>
              <li className='nav-li' id='monochrome'>Monochrome</li>
              <li className='nav-li' id='polychrome'>Polychrome</li>
            </ul>

          </div>
          <p className='drag-instruct'>Drag to Re-order</p>
          <AnimatePresence>
            {currentGallery === 'all' && <ReorderComponent values={allThumbElements} onReorder={setAllThumbElements} makeEdit={makeEdit} deleteEntry={deleteEntry} authData={authData} /> }
            {currentGallery === 'monochrome' && <ReorderComponent values={monoThumbElements} onReorder={setMonoThumbElements} makeEdit={makeEdit} deleteEntry={deleteEntry} authData={authData} /> }
            {currentGallery === 'polychrome' && <ReorderComponent values={polyThumbElements} onReorder={setPolyThumbElements} makeEdit={makeEdit} deleteEntry={deleteEntry} authData={authData} /> }
          </AnimatePresence>
        </>
    }</div>
  );
}