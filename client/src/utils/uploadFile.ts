import { getPresignedUrl } from '@api/index';
import { FILE_UPLOAD_MESSAGE, TOAST_MESSAGE } from '@constants/MESSAGE';

const uploadFile = async (file: File) => {
  if (!isJpegOrPng(file)) throw FILE_UPLOAD_MESSAGE.INVALID_TYPE;
  const uploadName = getUploadName(file.name);
  const presignedURL = await getPresignedUrl(uploadName);
  const response = await fetchFile(presignedURL.url, file);
  if (!response.url) throw TOAST_MESSAGE.ERROR.FILE_UPLOAD;

  return getUploadURL(uploadName);
};

const isJpegOrPng = (file: File) => file.type.match('image/jpeg|image/png');

const getUploadName = (fileName: string) => `${new Date().toLocaleString()}-${fileName}`;

const getUploadURL = (responseURL: string) =>
  `https://kr.object.ncloudstorage.com/duxcord/${responseURL}`;

const fetchFile = (presignedURL: string, file: File) =>
  fetch(
    new Request(presignedURL, {
      method: 'PUT',
      credentials: 'include',
      body: file,
      headers: new Headers({
        'x-amz-acl': 'public-read',
      }),
    }),
  );

export { uploadFile };
