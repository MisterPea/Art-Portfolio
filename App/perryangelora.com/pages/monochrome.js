import Head from 'next/head';
import Image from 'next/image';


export async function getStaticProps(){
  const res = await fetch('https://s3.amazonaws.com/perryangelora.com/cms/cms.json');
  const jsonDoc = await res.json();
  const monoJson = await jsonDoc.filter((thumb) => thumb.gallery === 'mono');
  return {
    props: {
      monoJson
    }
  };
}


export default function Monochrome({ monoJson }){

  return (
    <ul className='gallery-ul'>{
      monoJson.map((elem ) => (
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