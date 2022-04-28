import { useEffect } from 'react';

/**
 * useEffect hook to propagate changes from individual galleries to main gallery.
 * @prop {Object[]} galleryThumbState Array of objects representing the individual gallery
 * @prop {Object[]} allThumbState Array of objects representing the all galleries
 * @prop {func} setAllThumbState Function to set the state for all thumbnail images
 * @prop {String} currentGallery The current selected gallery view. i.e. 'all/mono/poly'
 * @prop {String} galleryString String of the name of the gallery. i.e. 'mono/poly'
 */
export default function usePropagateReorder(galleryThumbState, allThumbState, setAllThumbState, currentGallery, galleryString){
  useEffect(() => {
    if (galleryThumbState.length > 0 && currentGallery === galleryString) {
      const galleryInitial = galleryString[0];
      let gallery_i = -1;
      const newAllThumbs = allThumbState.map((elem, i) => {
        if(elem.gallery[0] === galleryInitial) {
          gallery_i += 1;
          return { ...galleryThumbState[gallery_i], order:`${galleryInitial}${i}` };
        } else {
          return elem;
        }
      });
      setAllThumbState(newAllThumbs);
    }
  }, [galleryThumbState]);

}