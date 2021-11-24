import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const endpoint = new AWS.Endpoint(process.env.S3_ENDPOINT!);
const region = process.env.S3_REGION;
const access_key = process.env.S3_ACCESS_KEY;
const secret_key = process.env.S3_SECRET_KEY;
const bucketName = process.env.S3_BUCKET_NAME;

const S3 = new AWS.S3({
  endpoint,
  region,
  credentials: {
    accessKeyId: access_key!,
    secretAccessKey: secret_key!,
  },
  signatureVersion: 'v4',
});

const getPresignUrl = async (fileName) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Expires: 60 * 60 * 3,
    ACL: 'public-read',
  };

  const signedUrlPut = await S3.getSignedUrlPromise('putObject', params);
  return signedUrlPut;
};

export { getPresignUrl };
