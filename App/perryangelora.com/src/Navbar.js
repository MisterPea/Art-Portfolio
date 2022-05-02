import Link from 'next/link';
import { useRouter } from 'next/router';


import * as React from 'react';

export default function Navbar() {
  const { pathname } = useRouter();

  /**
   * Helper function to see what is the current page and update the classNames accordingly 
   * @param {String} classes The classNames of the tag
   * @returns Returns 'active' and classNames if it's the current page or just the classNames by themselves. 
   */
  const setClass = (classes) => {
    const classArray = classes.split(' ');
    if(classArray.includes(pathname.split('/')[1])) {
      return `${classes} active`;
    } else {
      return classes;
    }
  };
  
  return (
    <div className='nav-header'>
      <h1>Perry<br />Angelora</h1>
      <menu>
        <Link href="/monochrome">
          <a className={`${setClass('menu-li monochrome')}`}>Monochrome</a>
        </Link>
        <Link href="/polychrome">
          <a className={`${setClass('menu-li polychrome')}`}>Polychrome</a>
        </Link>
        <Link href="/about">
          <a className={`${setClass('menu-li about')}`}>About</a>
        </Link>
      </menu>
    </div>
  );
}