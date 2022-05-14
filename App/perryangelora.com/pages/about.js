import Head from 'next/head';
import { AiOutlineMail, AiOutlineInstagram } from 'react-icons/ai';

export default function About() {
  function buttonClick(route) {
    window.open(route, '_blank');
  }

  function renderEmail() {
    const decoded = [];
    const sorted = ' :!?.@=abceghHijlmnoprstuy';
    const numArray = [
      17,  7, 14, 16, 23, 19,  1, 20, 10, 21, 21,
      25,  4,  7, 18, 11, 10, 16, 19, 21,  7,  5,
      11, 17,  7, 14, 16,  4,  9, 19, 17,  3, 22,
      24,  8, 15, 10,  9, 23,  6, 13, 10, 16, 16,
      19,  0, 23, 12, 10, 21, 10,  2
    ];
    for (let i = 0; i < numArray.length; i += 1) {
      decoded.push(sorted[numArray[i]]);
    }0;
    return decoded.join('');
  }
  function emailClick() {
    return window.location.href = renderEmail();
  }

  return (
    <>
      <Head>
        <meta name='title' content='About' key='about-title'/>
        <meta name='description' content='About Perry Angelora' key='about-desc'/>
      </Head>
      <div className='bio'>
        <h2>About</h2>
        <p>Born on Long Island, New York, Perry earned his BFA from the University of Central Florida and his MFA from the Pratt Institute, Brooklyn.
    He has exhibited his work both nationally and internationally and has taught at Montclair State University, Hunter College, and Edinburgh College of Art Summer School. In 2015 he was a recipient of the <i>New York Foundation for the Arts Fellowship in Printmaking/Drawing/Book Arts</i> and was a finalist for the <i>2017 Alexander Rutsch Award and Solo Exhibition for Painting.</i>
        <br /><br />Perry lives and works in Brooklyn, New York.</p>
        <div className='social'>
          <ul>   <li className='instagram-icon' onClick={() => buttonClick('https://www.instagram.com/perry_angelora/')}>
            <AiOutlineInstagram className='instagram-svg' />
          </li>
          <li className='email-icon' onClick={emailClick}>
            <AiOutlineMail className='email-svg' />
          </li></ul>
        </div>
      </div>
    </>
  );
}
