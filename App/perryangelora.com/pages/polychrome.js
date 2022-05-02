import Head from 'next/head';
import Image from 'next/image';


export async function getStaticProps(){
  const res = await fetch('https://s3.amazonaws.com/perryangelora.com/cms/cms.json');
  const jsonDoc = await res.json();
  const polyJson = await jsonDoc.filter((thumb) => thumb.gallery === 'poly');
  return {
    props: {
      polyJson
    }
  };
}

export default function Polychrome({ polyJson }){

  return (
    <ul className='gallery-ul'>{
      polyJson.map((elem ) => (
        <li className="gallery-item" key={elem.id}>
          <Image 
            src={`https://s3.amazonaws.com/perryangelora.com/cms/thumbs/${elem.thumbFileName}`}
            height={200}
            width={200}
            alt={`${elem.name} - ${elem.medAndSize}}`}
          />
        </li>
      ))
    }</ul>
    
  );
}