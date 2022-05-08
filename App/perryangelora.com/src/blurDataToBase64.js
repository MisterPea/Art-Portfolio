import { decode } from 'blurhash';

export default function blurDataToBase64(blurHash, widthRatio, heightRatio) {

  return (() => {
    const size = { w: Math.trunc(widthRatio * 40), h: Math.trunc(heightRatio * 40) };
    const pixels = decode(blurHash, size.w, size.h, 1);
    const canvas = document.createElement('CANVAS');
    canvas.width = size.w;
    canvas.height = size.h;
    const context = canvas.getContext('2d');
    const imageData = context.createImageData(size.w, size.h);
    imageData.data.set(pixels);
    context.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.7);
  })();
 
}