/**
 * Utility method to determine scaling of image as determined by 
 * the aspect ration of the viewport.
 * @param {Number} imgH 1 or a 1 + a decimal representing the ratio of H to W
 * @param {Number} imgW 1 or a 1 + a decimal representing the ratio of W to H
 * @returns Returns an object
 */
const setImageSize = (imgH, imgW) => {
  // imgH, imgW is a ratio
  // get frame size and ratio
  const imageSizeSet = { h:0, w:0 };
  const frameRatio = { h: 1, w: 1 };
  const frameHeight = window.innerHeight;
  const frameWidth = window.innerWidth;
  const largeShrink = 0.90;
  const smallShrink = 0.95;

  if(frameHeight > frameWidth) {
    frameRatio.h = frameHeight / frameWidth;
  } else {
    frameRatio.w = frameWidth / frameHeight;
  }
  
  if(frameRatio.h === 1) {
    // horizontal frame
    if(imgH === 1 && frameRatio.w > imgW) {
      imageSizeSet.h = frameHeight * smallShrink;
      imageSizeSet.w = imgW / imgH * imageSizeSet.h;
    } else if(imgW === 1) {
      imageSizeSet.h = frameHeight * smallShrink;
      imageSizeSet.w = imgW / imgH * imageSizeSet.h;
    } else {
      imageSizeSet.w = frameWidth * smallShrink;
      imageSizeSet.h = imgH/imgW * imageSizeSet.w;
      // imageSizeSet.h = frameHeight * smallShrink;
      // imageSizeSet.w = imageSizeSet.h * imgW;
    }
  } else if(frameRatio.w === 1){ 
    // vertical frame
    //vertical image
    if(imgW === 1 && frameRatio.h > imgH) {
      imageSizeSet.w = frameWidth * smallShrink;
      imageSizeSet.h = imgH /imgW * imageSizeSet.w;
      // horizontal image
    } else if(imgH === 1) {
      imageSizeSet.w = frameWidth * smallShrink;
      imageSizeSet.h = imgH/imgW * imageSizeSet.w;
      // large vertical image
    } else {
      imageSizeSet.h = frameHeight * largeShrink;
      imageSizeSet.w = imgW / imgH * imageSizeSet.h;
    }
  }
  return { h:Math.ceil(imageSizeSet.h), w: Math.ceil(imageSizeSet.w) };
};

export default setImageSize;
