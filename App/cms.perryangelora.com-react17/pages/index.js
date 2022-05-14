import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Navbar from '../src/components/Navbar';
import ThumbCreator from '../src/components/ThumbCreator';
import ThumbDisplay from '../src/components/ThumbDisplay';
import { S3, S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import ModalComponentWrapper from '../src/components/ModalComponentWrapper';
import axios from 'axios';
import Button from '../src/components/Button';
import IncludeMobile from '../src/components/IncludeMobile';

export async function getServerSideProps() {
  
  const S3 = new S3Client({
    credentials:{
      accessKeyId:process.env.AWS_S3_ACCESS,
      secretAccessKey:process.env.AWS_S3_SECRET
    },
    region: 'us-east-1'
  });

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
  const { status } = useSession();
  const [edit, setEdit] = useState({ id:undefined, file:undefined, title:'', medAndSize:'', gallery:'', thumbXY:{ x:0, y:0 }, magnification:5 });
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const year = new Date().getFullYear();

  const router = useRouter();
  
  // Method to force a reload to trigger getServerSideProps
  function refreshData() {
    router.replace(router.asPath);
  }

  useEffect(() => {
    const query = router.query;
    const queryKeys = Object.keys(query);
    if(queryKeys) {
      // if unauthenticated && accessDenied then show error modal.
      if(query[queryKeys[0]] === 'AccessDenied' && status === 'unauthenticated') {
        setOpenErrorModal(true);
      }
      // if authenticated && accessDenied then push change
      if(query[queryKeys[0]] === 'AccessDenied' && status === 'authenticated') {
        resetPath();
      }
    }
  }, [router.query, status]);

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
    setEdit({ id:undefined, file:undefined, title:'', medAndSize:'', gallery:'', thumbXY:{ x:0, y:0 }, magnification:5 });
  }

  function resetPath(){
    router.replace('/');
    if(openErrorModal === true) {
      setOpenErrorModal(false);
    }
  }

  function LoginError({ setModalOpen }){

    return (
      <>
        <h1>You must be an authorized user to log in</h1>
        <div className="button-wrapper">
          <Button action={setModalOpen} label="Close" color="green" />
        </div>
      </>
    );
  }

  function deleteEntry(id){
    axios({
      method:'DELETE',
      url: 'api/deleteEntry',
      data: { id, thumbContents }
    }).then(() => refreshData())
      .catch((err) => console.log(err));
  }
  
  return (
    <>
      {openErrorModal && 
        <ModalComponentWrapper close={resetPath}>
          <LoginError />
        </ModalComponentWrapper>}
      <Navbar />
      <div className='include-mobile'>
        <IncludeMobile />
      </div>
      <div className='exclude-mobile'>
        <ThumbCreator thumbs={thumbContents} refresh={refreshData} toEdit={edit} resetEdit={resetEditEntry} />
        <ThumbDisplay thumbs={thumbContents} makeEdit={editEntry} deleteEntry={deleteEntry} />
      </div>
      <footer>{`©${year} Perry Angelora`}</footer>
    </>
  );
}
