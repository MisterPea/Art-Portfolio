import axios from 'axios';

/**
 * Hook to handle the pushing of newly-ordered json to the server
 * @param {Objects[]} currThumbs Current state of all thumbs
 * @param {Object} prevThumbs useRef Object to set current order of thumbs to allow for comparison on update
 */
export default function pushUpdateOrder(currThumbs, prevThumbs){
  const JsonData = new FormData();
 

  // reset the order numbering to 0 - n
  const newThumbArray = currThumbs.map((thumb, index) => {
    return { ...thumb, order: `${thumb.order[0]}${index}` };
  });

  const jsonFile = new File([JSON.stringify(newThumbArray, null, '\t')], 'cms.json', { type:'application/json' });
  JsonData.append('file', jsonFile, 'cms.json');
  axios({
    method:'POST',
    url:'api/upload/json',
    data: JsonData,
    headers: {
      'Content-Type':'multipart/form-data'
    }
  }).then(() => {
    console.log('Change Complete');
    prevThumbs.current = newThumbArray;
  })
    .catch((err) => console.log(err));
}
