import { VscChromeClose } from 'react-icons/vsc';
export default function CircleButton({ clickHandle }) {
  return (
    <VscChromeClose onClick={clickHandle} className='circle-button' />
  );
}