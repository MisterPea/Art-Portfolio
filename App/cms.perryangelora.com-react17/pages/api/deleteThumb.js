import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

export default async function handler(req, res) {
  
  const S3 = new S3Client({
    accessKeyId: process.env.AWS_S3_ACCESS,
    secretAccessKey: process.env.AWS_S3_SECRET,
    region: 'us-east-1'
  });
 
  const thumbParams = {
    Bucket: 'perryangelora.com',
    Key: `cms/thumbs/${req.body}`
  };

  const deleted = await S3.send(new DeleteObjectCommand(thumbParams));
  res.status(200).json({ success: deleted.$metadata.httpStatusCode === 204 });
}




