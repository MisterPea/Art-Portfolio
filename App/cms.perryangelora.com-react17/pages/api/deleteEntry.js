import { S3Client, DeleteObjectCommand, PutObjectCommand} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import axios from 'axios';

export default async function handler(req, res) {
  const {id, thumbContents} = req.body;
  const thumbs = JSON.parse(thumbContents);
  const fileNames = (() => {
    for(let i = 0; i < thumbs.length; i += 1) {
      if(thumbs[i].id === id) {
        return {thumb: thumbs[i].thumbFileName, image: thumbs[i].mainFileName};
      }
    }
  })();

  const newThumbs = thumbs.filter((thumb) => thumb.id !== id);
  const fileBuffer = Buffer.from(JSON.stringify(newThumbs));

  const S3 = new S3Client({
    accessKeyId: process.env.AWS_S3_ACCESS,
    secretAccessKey: process.env.AWS_S3_SECRET,
    region: 'us-east-1'
  });
 
  const thumbParams = {
    Bucket: 'perryangelora.com',
    Key: `cms/thumbs/${fileNames.thumb}`
  };

  const imageParams = {
    Bucket: 'perryangelora.com',
    Key: `cms/images/${fileNames.image}`
  };

  const jsonParams = {
    Bucket: 'perryangelora.com',
    Key: 'cms/cms.json',
  };

  const command = new PutObjectCommand(jsonParams);  
  const url = await getSignedUrl(S3, command);
  const deleteThumb = await S3.send(new DeleteObjectCommand(thumbParams));
  const deleteImage = await S3.send(new DeleteObjectCommand(imageParams));
  const updateJSON = await axios({
    method:'PUT',
    url,
    data: fileBuffer
  }).then(() => {return true;})
    .catch((err) => console.log('FAIL:', err));

  res.status(200).json({success: updateJSON && deleteImage.$metadata.httpStatusCode === 204 && deleteThumb.$metadata.httpStatusCode === 204})

}




