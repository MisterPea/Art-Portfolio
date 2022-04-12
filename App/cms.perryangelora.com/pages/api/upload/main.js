import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import formidable from 'formidable';
import fs from 'fs';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: false,
  }
};
export default async function handler(req, res) {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    const params = {
      Bucket: 'perryangelora.com',
      Key: `cms/images/${files.file.originalFilename}`,
    };
    const S3 = new S3Client({region: 'us-east-1'});
    const command = new PutObjectCommand(params);  
    const fileBuffer = fs.readFileSync(files.file.filepath);
    const url = await getSignedUrl(S3, command);
    axios({
      method: 'PUT',
      url,
      data: fileBuffer
    }).then(() => res.status(200).send())
      .catch((err) => console.log('THUMB_ERR:', err));
  });
}
