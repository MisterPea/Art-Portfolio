
import { useEffect, useState, useRef } from "react";
import Button from "./Button";

// create up / down range
export default function ThumbCreator() {
  const [fileState, setFileState] = useState(null);
  const mag = useRef(5)
  const [mouseDown, setMouseDown] = useState(false);
  const canvas = useRef(null);
  const ctx = useRef(null);
  const img = useRef(null);
  const windowSize = { h: 400, w: 400 };
  const dragStartXY = useRef({ x: 0, y: 0 });
  const imageStartXY = useRef({ x: 0, y: 0 });
  const reader = useRef();

  // Instantiate Canvas
  useEffect(() => {
    if (canvas.current === null && ctx.current === null) {
      reader.current = new FileReader();
      canvas.current = document.getElementById("main-canvas");
      ctx.current = canvas.current.getContext('2d');
      ctx.current.imageSmoothingEnabled = false;
      ctx.current.mozImageSmoothingEnabled = false;
      ctx.current.webkitImageSmoothingEnabled = false;
    }
    if (img.current === null) {
      img.current = new Image();
    }
  }, []);

  // Run on fileState/load
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

  // Magnification Calls
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

  function clearAndDraw() {
    const { w, h } = deriveImgDimensions();
    ctx.current.clearRect(0, 0, windowSize.h, windowSize.w);
    ctx.current.drawImage(
      img.current,
      imageStartXY.current.x, imageStartXY.current.y,
      (windowSize.w * w * mag.current).toFixed(2), (windowSize.h * h * mag.current).toFixed(2));
  }

  function addImage(e) {
    if (e.target.files && e.target.files[0]) {
     // Insert - save file to local...then up to s3 
      reader.current.readAsDataURL(e.target.files[0]);
      reader.current.addEventListener("load", addImage);
      reader.current.onload = (f) => {
        setFileState(f.target.result);
      };
    }
  }

  function createDataURI() {
    let imageData = canvas.current.toDataURL();
    console.log(imageData);
  }

  function handleUploadClick(){
    mag.current = 5; // reset <------ also slider
    document.getElementById('fileUpload').click();

  }
  const accepted = ".jpg, .jpeg, .gif, .tiff, .tif, .webp, .png";

  return (
    <div className="App">
      <input
        onChange={(e) => handleMag(e)}
        id="range"
        type="range"
        min="10"
        max="100"
        // value={mag * 10}
      />
      <Button label="Upload Image" action={handleUploadClick}/>
      <input id="fileUpload" onChange={(e) => addImage(e)} type="file" accept={accepted} />
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
      <Button action={createDataURI} label="Add Image" />
    </div>
  );
}
