import { Reorder, useMotionValue } from 'framer-motion';
import { useRaisedShadow } from '../hooks/useRaisedShadow';
import Image from 'next/image';

export const ThumbItem = ({thumb, deleteEntry, makeEdit}) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  return (
    
    <Reorder.Item value={thumb} style={{boxShadow, y}}>
      <div className='thumb-list-item'>
        <Image
          src={`https://s3.amazonaws.com/perryangelora.com/cms/thumbs/${thumb.thumbFileName}`}
          alt={`${thumb.name} thumbnail image`}
          height={100}
          width={100}
          layout='raw'
        />
        <div className='text-holder'>
          <h3>{thumb.name}</h3>
          <h4>{thumb.medAndSize}</h4>
        </div>
        <div className='button-wrapper'>
          <button onClick={() => deleteEntry(thumb.id)}>Delete</button>
          <button onClick={() => makeEdit(thumb.id, thumb.mainFileName, thumb.name, thumb.medAndSize, thumb.gallery, thumb.thumbXY, thumb.magnification)}>Edit</button>
        </div>
      </div>

    </Reorder.Item>
  );
};