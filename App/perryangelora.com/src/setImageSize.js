const setImageSize = (imgH, imgW) => {
  // imgH, imgW is a ratio
  // get frame size and ratio
  const imageSizeSet = { h:0, w:0 };
  const frameRatio = { h: 1, w: 1 };
  const frameHeight = window.innerHeight;
  const frameWidth = window.innerWidth;
  const shrink = 0.95;

  if(frameHeight > frameWidth) {
    frameRatio.h = frameHeight / frameWidth;
  } else {
    frameRatio.w = frameWidth / frameHeight;
  }
  
  if(frameRatio.h === 1) {
    // horizontal frame
    // horizontal image
    if(imgH === 1 && imgW <= frameRatio.w) {
      imageSizeSet.h = frameHeight * shrink;
      imageSizeSet.w = imageSizeSet.h * imgW;
    } else {
      // vertical image
      imageSizeSet.h = frameHeight * shrink;
      imageSizeSet.w = imgW / imgH * imageSizeSet.h;
    }
  } else { 
    // vertical frame
    // vertical image
    if(imgW === 1 && imgH <= frameRatio.h) {
      imageSizeSet.w = frameWidth * shrink;
      imageSizeSet.h = imageSizeSet.w * imgH;
    } else {
      imageSizeSet.w = frameWidth * shrink;
      imageSizeSet.h = imgH / imgW * imageSizeSet.w;
    }
  }
  return { h:Math.ceil(imageSizeSet.h), w: Math.ceil(imageSizeSet.w) };
};

export default setImageSize;
