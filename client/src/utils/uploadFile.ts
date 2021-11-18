import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const endpoint = new AWS.Endpoint(process.env.REACT_APP_S3_ENDPOINT!);
const region = 'kr-standard';
const access_key = process.env.REACT_APP_S3_ACCESS_KEY;
const secret_key = process.env.REACT_APP_S3_SECRET_KEY;

const S3 = new AWS.S3({
  endpoint,
  region,
  credentials: {
    accessKeyId: access_key!,
    secretAccessKey: secret_key!,
  },
});

const bucketName = 'duxcord';

export const uploadFileToStorage = async (file: File) => {
  const uploadName = `${new Date().toLocaleString()}-${file.name}`;
  try {
    const uploadRequest = await S3.putObject({
      Bucket: bucketName,
      Key: uploadName,
      ACL: 'public-read',
      Body: file,
    }).promise();

    const { $response } = uploadRequest;
    switch ($response.httpResponse.statusCode) {
      case 200:
        const createdURL = `${process.env.REACT_APP_S3_ENDPOINT!}/${bucketName}/${uploadName}`;
        return createdURL;
      default:
        throw new Error('Bad Request');
    }
  } catch (err) {
    console.error(err);
  }
};
