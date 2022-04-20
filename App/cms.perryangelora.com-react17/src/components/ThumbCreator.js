import { useEffect, useState, useRef } from 'react';
import Button from './Button';
import TextInput from './TextInput';
import CircleButton from './CircleButton';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';
import Loading from './Loading';

/**
 * Component to create a thumbnail based on user upload and user scaling.
 * @returns {JSX} Returns JSX
 */
export default function ThumbCreator({thumbs, refresh, toEdit, resetEdit}) {

  const [fileState, setFileState] = useState(null);
  const [text, setText] = useState({title:'', medAndSize:'', gallery:''});
  const [isIngesting, setIsIngesting] = useState(false);
  const mag = useRef(5);
  const [mouseDown, setMouseDown] = useState(false);
  const canvas = useRef(null);
  const ctx = useRef(null);
  const img = useRef(null);
  const mainImage = useRef(null);
  const windowSize = { h: 350, w: 350 };
  const dragStartXY = useRef({ x: 0, y: 0 });
  const imageStartXY = useRef({ x: 0, y: 0 });
  const reader = useRef();
  const accepted = '.jpg, .jpeg, .gif, .tiff, .tif, .webp, .png';
 
  // Instantiate Canvas and FileReader. Note: within NextJS SSR, browser APIs
  // need to be placed in useEffect, so they are initiated on mount.
  useEffect(() => {
    if (canvas.current === null && ctx.current === null) {
      reader.current = new FileReader();
      canvas.current = document.getElementById('main-canvas');
      ctx.current = canvas.current.getContext('2d');
      ctx.current.imageSmoothingEnabled = false;
      ctx.current.mozImageSmoothingEnabled = false;
      ctx.current.webkitImageSmoothingEnabled = false;
    }
    if (img.current === null) {
      img.current = new Image();
    }
  }, []);

  // Run on fileState/load change
  useEffect(() => {
    if (img.current) {
      img.current.onload = () => {
        clearAndDraw();
      };

      if (fileState !== null) {
        img.current.src = fileState;
      }
    }
  }, [fileState]);

  useEffect(() => {
    if(toEdit.file) {
      const {file, title, medAndSize, gallery, thumbXY, magnification} = toEdit;
      axios({
        method:'POST',
        url: 'api/getEditImage',
        data:{url:`https://s3.amazonaws.com/perryangelora.com/cms/images/${file}`}
      }).then((data) => {
        imageStartXY.current = (thumbXY);
        mag.current = magnification;
        document.querySelector('.magnification-slider').value = `${magnification * 10}`;
        setFileState('data:image/jpeg;base64,' + data.data);
        setText({title, medAndSize, gallery});
      });
    }
  }, [toEdit]);
  /**
   * Method to handle calls to magnify the image
   * @param {*} e Element passed from onChange handler
   */
  function handleMag(e) {
    const { h, w } = deriveImgDimensions();
    const prevMag = mag.current;
    const currentMag = e.target.value / 10;
    mag.current = e.target.value / 10;
    checkAndUpdateMagnification(prevMag, currentMag);
  }

  function handleMouseDown(e) {
    !mouseDown && setMouseDown(true);
    // get coordinates of pointer - to calculate x/y change
    dragStartXY.current = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
  }

  function handleTouchDown(e) {
    !mouseDown && setMouseDown(true);
    const offsetX = e.touches[0].pageX - e.touches[0].target.offsetLeft;
    const offsetY = e.touches[0].pageY - e.touches[0].target.offsetTop;
    dragStartXY.current = { x: offsetX, y: offsetY };
  }

  function handleMouseUp() {
    mouseDown && setMouseDown(false);
  }

  function handleMouseMove(e) {
    if (mouseDown) {
      const requestX = e.nativeEvent.offsetX - dragStartXY.current.x + imageStartXY.current.x;
      const requestY = e.nativeEvent.offsetY - dragStartXY.current.y + imageStartXY.current.y;
      checkAndUpdateImgXY(Math.ceil(requestX), Math.ceil(requestY));
      dragStartXY.current.x = e.nativeEvent.offsetX;
      dragStartXY.current.y = e.nativeEvent.offsetY;
    }
  }

  function handleTouchMove(e) {
    if (mouseDown) {
      const offsetX = e.touches[0].pageX - e.touches[0].target.offsetLeft;
      const offsetY = e.touches[0].pageY - e.touches[0].target.offsetTop;
      const requestX = offsetX - dragStartXY.current.x + imageStartXY.current.x;
      const requestY = offsetY - dragStartXY.current.y + imageStartXY.current.y;
      checkAndUpdateImgXY(requestX, requestY);
      dragStartXY.current.x = e.touches[0].pageX - e.touches[0].target.offsetLeft;
      dragStartXY.current.y = e.touches[0].pageY - e.touches[0].target.offsetTop;
    }
  }

  function checkAndUpdateImgXY(requestX, requestY) {
    // only update if x/y changes
    let updateX = true;
    let updateY = true;

    const { w, h } = deriveImgDimensions();
    const imgW = (windowSize.w * w * mag.current).toFixed(2);
    const imgH = (windowSize.h * h * mag.current).toFixed(2);

    if (requestX >= 0) {
      imageStartXY.current.x = 0;
    } else if (+(imgW - w + requestX) >= windowSize.w) {
      imageStartXY.current.x = requestX;
    } else {
      const finalRequestX = windowSize.w - (imgW - w + requestX) + imageStartXY.current.x;
      if (finalRequestX < 0) {
        imageStartXY.current.x = finalRequestX;
      } else if (imageStartXY.current.x !== 0) {
        imageStartXY.current.x = 0;
      } else {
        updateX = false;
      }
    }

    if (requestY > 0) {
      imageStartXY.current.y = 0;
    } else if ((imgH - h + requestY) > windowSize.h) {
      imageStartXY.current.y = requestY;
    } else {
      const finalRequestY = windowSize.w - (imgH - h + requestY) + imageStartXY.current.y;
      if (finalRequestY < 0) {
        imageStartXY.current.y = finalRequestY;
      } else if (imageStartXY.current.y !== 0) {
        imageStartXY.current.y = 0;
      } else {
        updateY = false;
      }
    }
    if (updateX && updateY) {
      window.requestAnimationFrame(clearAndDraw);
    }
  }

  function checkAndUpdateMagnification(prevMag, currentMag) {
    const { w, h } = deriveImgDimensions();
    if (prevMag > currentMag) {
      const imgW = (windowSize.w * w * mag.current).toFixed(2);
      const imgH = (windowSize.h * h * mag.current).toFixed(2);

      const imgXAndOffset = Number(imgW) + Number(imageStartXY.current.x);
      const imgYAndOffset = Number(imgH) + Number(imageStartXY.current.y);
      const xDifference = imgXAndOffset - windowSize.w;
      const yDifference = imgYAndOffset - windowSize.h;
      let requestX = imageStartXY.current.x;
      let requestY = imageStartXY.current.y;

      if (xDifference < 0) {
        requestX += (xDifference * -1);
      }
      if (yDifference < 0) {
        requestY += (yDifference * -1);
      }
      imageStartXY.current.x = Math.ceil(requestX);
      imageStartXY.current.y = Math.ceil(requestY);
    }
    window.requestAnimationFrame(clearAndDraw);
  }

  /**
   * Helper method to derive the aspect ration of the image
   * @returns Returns a Object with width and height, as `w` and `h`.
   * At least one of the numbers will be 1.
   */
  function deriveImgDimensions() {
    const w = img.current.width;
    const h = img.current.height;
    let ratio = 1;
    let outputRatio = {
      w: 1,
      h: 1
    };
    if (w < h) {
      ratio = h / w;
      outputRatio.h = ratio;
    } else if (w > h) {
      ratio = w / h;
      outputRatio.w = ratio;
    }
    return outputRatio;
  }

  /**
   * Method to render an image inside of a Canvas element.
   */
  function clearAndDraw() {
    const { w, h } = deriveImgDimensions();
    ctx.current.clearRect(0, 0, windowSize.h, windowSize.w);
    ctx.current.drawImage(
      img.current,
      imageStartXY.current.x, imageStartXY.current.y,
      (windowSize.w * w * mag.current).toFixed(2), (windowSize.h * h * mag.current).toFixed(2));
  }

  /**
   * Method to take an uploaded allow it to be used as an `<img>` in a Canvas object, and to be uploaded elsewhere.
   * @param {*} e 
   */
  function addImage(e) {
    if (e.target.files && e.target.files[0]) {
      mainImage.current = e.target.files[0];
      reader.current.readAsDataURL(e.target.files[0]);
      reader.current.addEventListener('load', addImage);
      reader.current.onload = (f) => {
        setFileState(f.target.result);
      };
    }
    // Reset Text id any of the fields are filled
    if(text.title.length + text.gallery.length + text.medAndSize.length > 0) {
      setText({title:'', medAndSize:'', gallery:''});
    }
  }
 
  /**
   * Method to update S3 with image and JSON files.
   */
  function sendFilesForIngest(){
    const uuid = uuidv4();
    const uploadComplete = {thumb: false, main: false, json: false};
    const thumbData = new FormData();
    const mainImgData = new FormData();
    const JsonData = new FormData();

    const lowerCanvas = document.querySelector('.lower-canvas-holder');
    lowerCanvas.classList.add('ingesting');
    setIsIngesting(true);

    const allUploadsComplete = () => {
      if(Object.values(uploadComplete).every((e) => e === true)) {
        setIsIngesting(false);
        lowerCanvas.classList.remove('ingesting');
        setFileState(null);
        mag.current = 5;
        setText({title:'', medAndSize:'', gallery:''});
        refresh();
      }
    };

    // Thumb Image Upload
    canvas.current.toBlob((blob) => {
      const img = new File([blob], `${uuid}_thumb.jpeg`, {type:'image/jpeg'});
      thumbData.append('file', img, `${uuid}_thumb.jpeg`);
      axios({
        method:'POST',
        url: 'api/upload/thumb',
        data: thumbData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(() => {
        uploadComplete.thumb = true;
        allUploadsComplete();;
      }).catch((err) => console.log(err));
    }, 'image/jpeg', 1.0);
  
    // Main Image Upload
    const extension = mainImage.current.name.split('.').pop();
    mainImgData.append('file', mainImage.current, `${uuid}.${extension}`);
    axios({
      method:'POST',
      url: 'api/upload/main',
      data: mainImgData,
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }).then(() => {
      uploadComplete.main = true;
      allUploadsComplete();
    })
      .catch((err) => console.log(err));

    const fileInfo = JSON.parse(thumbs);
    const fileJson = {
      order:`${text.gallery[0]}${fileInfo.length}`,
      id: uuid,
      name: text.title,
      medAndSize: text.medAndSize,
      thumbFileName: `${uuid}_thumb.jpeg`,
      mainFileName: `${uuid}.${extension}`,
      gallery: text.gallery,
      thumbXY: imageStartXY.current,
      magnification: mag.current,
    };
    fileInfo.push(fileJson);

    const jsonFile = new File([JSON.stringify(fileInfo, null, '\t')], 'cms.json', {type:'application/json'});
    JsonData.append('file', jsonFile, 'cms.json');
    axios({
      method:'POST',
      url:'api/upload/json',
      data: JsonData,
      headers: {
        'Content-Type':'multipart/form-data'
      }
    }).then(() => {
      uploadComplete.json = true;
      allUploadsComplete();
    })
      .catch((err) => console.log(err));
  }
  /**
   * Method to update the text and/or thumbnail image.
   * The JSON file will be update and a new thumbnail will be created with each instance
   */
  function updateRecord(){ 
    const uuid = uuidv4();
    const JsonData = new FormData();
    const thumbData = new FormData();
    const uploadComplete = {thumb: false, json: false, deleteOldThumb: false};

    const lowerCanvas = document.querySelector('.lower-canvas-holder');
    lowerCanvas.classList.add('ingesting');
    setIsIngesting(true);

    const allUploadsComplete = () => {
      if(Object.values(uploadComplete).every((e) => e === true)) {
        setIsIngesting(false);
        lowerCanvas.classList.remove('ingesting');
        setFileState(null);
        mag.current = 5;
        setText({title:'', medAndSize:'', gallery:''});
        resetEdit();
        refresh();
      }
    };

    const deleteThumb = (filename) => {
      axios({
        method:'DELETE',
        url:'api/deleteThumb',
        data: filename
      }).then(() => {
        uploadComplete.deleteOldThumb = true;
        allUploadsComplete();
      });
    };

    // Thumb Upload
    canvas.current.toBlob((blob) => {
      console.log(`${toEdit.id}_thumb.jpeg`);
      const img = new File([blob], `${uuid}_thumb.jpeg`, {type:'image/jpeg'});
      thumbData.append('file', img, `${uuid}_thumb.jpeg`);
      axios({
        method:'POST',
        url: 'api/upload/thumb',
        data: thumbData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(() => {
        uploadComplete.thumb = true;
        allUploadsComplete();
      }).catch((err) => console.log(err));
    }, 'image/jpeg', 1.0);

    const fileInfo = JSON.parse(thumbs);
    const newFileInfo = fileInfo.map((element) => {
      if(element.id === toEdit.id){
        deleteThumb(element.thumbFileName);
        return {
          order: element.order,
          id: element.id,
          name: text.title,
          medAndSize: text.medAndSize,
          thumbFileName: `${uuid}_thumb.jpeg`,
          mainFileName: element.mainFileName,
          gallery: text.gallery,
          thumbXY: imageStartXY.current,
          magnification: mag.current,
        };
      } else {
        return element;
      }
    });

    const jsonFile = new File([JSON.stringify(newFileInfo, null, '\t')], 'cms.json', {type:'application/json'});
    JsonData.append('file', jsonFile, 'cms.json');
    axios({
      method:'POST',
      url:'api/upload/json',
      data: JsonData,
      headers: {
        'Content-Type':'multipart/form-data'
      }
    }).then(() => {
      uploadComplete.json = true;
      allUploadsComplete();
    })
      .catch((err) => console.log(err));
  }


  function handleInputText(e) {
    if(e.target.id === 'Title:') {
      setText({title: e.target.value, medAndSize: text.medAndSize, gallery: text.gallery});
    } else if(e.target.id === 'Medium/Size:'){
      setText({title: text.title, medAndSize: e.target.value, gallery: text.gallery});
    } else {
      setText({title: text.title, medAndSize: text.medAndSize, gallery: e.target.value});
    }
  }

  /**
   * Method to close the area with the uploaded image.
   */
  function handleCloseButton() {
    setText({title:'', medAndSize:'', gallery:''});
    setFileState(null);
  }

  function handleUploadClick() {
    if(toEdit.file) {
      resetEdit();
    }
    document.querySelector('.magnification-slider').value = '30';
    document.getElementById('fileUpload').click();
  }

  

  return (
    <div className='canvas-background'> 
      <div className="canvas-holder">
        <div className={`top-buttons-bar ${fileState ? 'active' : ''}`}>
          <Button label="Upload Image" action={handleUploadClick} />
          <CircleButton clickHandle={handleCloseButton} />
          <input id="fileUpload" onChange={(e) => addImage(e)} type="file" accept={accepted} />
        </div>
        {isIngesting && <Loading />}
        <div className={`lower-canvas-holder ${fileState ? 'active' : ''}`}>
          <canvas
            onTouchMove={handleTouchMove}
            onTouchStart={handleTouchDown}
            onTouchEnd={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            id="main-canvas"
            height={windowSize.h}
            width={windowSize.w}
          >
          Canvas Not Available
          </canvas>
          <TextInput action={handleInputText} value={text.title} label="Title:" placeholder="Enter Title" />
          <TextInput action={handleInputText} value={text.medAndSize} label="Medium/Size:" placeholder="Enter Medium and Size" />
          <TextInput action={handleInputText} value={text.gallery} label="Gallery:" placeholder="Enter Gallery Title" />
          <input
            className="magnification-slider"
            onChange={(e) => handleMag(e)}
            id="range"
            type="range"
            min="10"
            max="50"
            step="0.1"
          />
          <Button
            action={toEdit.id ? updateRecord: sendFilesForIngest }
            label={toEdit.id ? 'Update Thumbnail' :'Add Thumbnail'}
            color="green"
            disabled={!text.title || !text.medAndSize || !text.gallery}
          />
        </div>
      </div>
    </div>
  );
}
