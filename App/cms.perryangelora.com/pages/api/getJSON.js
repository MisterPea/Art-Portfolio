import { S3, S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

export default async function handler(req, res) {
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
  const bodyContents = await streamToString(Body);  
  res.status(200).json(bodyContents);
}




