import { Reorder } from 'framer-motion';
import { ThumbItem } from './ThumbItem';

export default function ReorderComponent({values, onReorder, makeEdit, deleteEntry}) {
  return (
    <Reorder.Group
      axis='y'
      values={values}
      onReorder={onReorder}
      layoutScroll
      className='thumb-list'
      style={{ overflowY: 'auto'}}
    >
      {values.map((thumb) => (
        <ThumbItem key={thumb.id} thumb={thumb} deleteEntry={deleteEntry} makeEdit={makeEdit} />
      ))
      }
    </Reorder.Group>
  );
}
