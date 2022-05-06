import { encode } from 'blurhash';

export default function encodeBlurHash(image){

  const imageData = (() => {
    const canvas = document.createElement('CANVAS');
    
    const imageRatio = { h:1, w:1 };
    const ratio = image.width / image.height;
  
    // Get/set aspect-ratio of image
    if(ratio > 1) {
      imageRatio.w = ratio;
      imageRatio.h = 1;
    } else {
      imageRatio.h = 1 / ratio;
      imageRatio.w = 1;
    }
    const newWidth = imageRatio.w * 400;
    const newHeight = imageRatio.h * 400; 

    canvas.width = newWidth;
    canvas.height = newHeight;
    const context = canvas.getContext('2d');

    context.drawImage(image, 0, 0, newWidth, newHeight);
    return context.getImageData(0, 0, newWidth, newHeight);
  })();
  
  return encode(imageData.data, imageData.width, imageData.height, 7, 7);
}