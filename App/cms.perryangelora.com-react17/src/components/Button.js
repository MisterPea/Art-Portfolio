import { useEffect, useRef, useState } from 'react';
/**
 * Button component
 * @param {string} label The name to be displayed on the button.
 * @param {func} action What method to called by onClick handler
 * @param {string} color If left blank, the button will be white with a black border. The other option is 'green', which will make the button green.
 * @param {Bool} disable Defaults to false. Make the button disabled with true.
 */
export default function Button({ label, action, color='', disabled=false, isPlaceholder=false, isLoading=false } ) {
  const defaultLabel = label;
  const [activeLabel, setActiveLabel] = useState(label);
  
  if(isLoading === true && activeLabel === defaultLabel){
    setActiveLabel('Loading...');
  }
  if(isLoading === false && activeLabel !== defaultLabel) {
    setActiveLabel(defaultLabel);
  }

  return (
    <button
      tabIndex={0}
      className={`main-rect-button${color ? ' ' + color:'' }${isPlaceholder ? ' placeholder':'' }${isLoading ? ' loading': ''}`}
      onClick={action}
      disabled={disabled}
    >
      {activeLabel}
    </button>
  );
}