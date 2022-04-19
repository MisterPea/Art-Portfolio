import Head from 'next/head';
import Image from 'next/image';
import {useState} from 'react';
import { useRouter } from 'next/router';
import Navbar from '../src/components/Navbar';
import ThumbCreator from '../src/components/ThumbCreator';
import ThumbDisplay from '../src/components/ThumbDisplay';
import { S3, S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import axios from 'axios';

export async function getServerSideProps() {
  const S3 = new S3Client({ region: 'us-east-1' });
  const params = {
    Bucket: 'perryangelora.com',
    Key: 'cms/cms.json',
  };
  const streamToString = (stream) =>
    new Promise((resolve, reject) => {
      const chunks = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });

  const { Body } = await S3.send(new GetObjectCommand(params));
  const thumbContents = await streamToString(Body);
  return {
    props: {
      thumbContents
    }
  };
}



export default function Home({ thumbContents }) { 
  const [edit, setEdit] = useState({id:undefined, file:undefined, title:'', medAndSize:'', gallery:'', thumbXY:{x:0, y:0}, magnification:5});

  const router = useRouter();
  // Method to force a reload to trigger getServerSideProps
  function refreshData() {
    router.replace(router.asPath);
  }

  /**
   * This serves as an intermediary between ThumbDisplay and ThumbCreator. On edit
   * click (in ThumbDisplay li) this callback is called with proper params for the image,
   * which are then passed into ThumbCreator for editing, triggered by a useEffect
   */
  function editEntry(id, mainFileName, name, medAndSize, gallery, thumbXY, magnification) {
    const editInfo = {
      id,
      file: mainFileName,
      title: name,
      medAndSize, 
      gallery,
      thumbXY,
      magnification,
    };
    setEdit(editInfo);
  }

  function resetEditEntry(){
    setEdit({id:undefined, file:undefined, title:'', medAndSize:'', gallery:'', thumbXY:{x:0, y:0}, magnification:5});
  }

  function deleteEntry(id){
    axios({
      method:'DELETE',
      url: 'api/deleteEntry',
      data: {id, thumbContents}
    }).then(() => refreshData())
      .catch((err) => console.log(err));
  }
  
  return (
    <>
      <Navbar />
      <ThumbCreator thumbs={thumbContents} refresh={refreshData} toEdit={edit} resetEdit={resetEditEntry} />
      <ThumbDisplay thumbs={thumbContents} makeEdit={editEntry} deleteEntry={deleteEntry} />
    </>
  );
}
