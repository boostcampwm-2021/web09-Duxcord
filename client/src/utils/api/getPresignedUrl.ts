import { postFetchOptions } from '@api/fetchOptions';
import { API_URL } from '@utils/constants/API_URL';

const getPresignedUrl = async (uploadName: string) => {
  try {
    const response = await fetch(API_URL.USER.GET_PRESIGNED_URL, postFetchOptions({ uploadName }));
    const url = await response.json();
    return url;
  } catch (error) {
    console.log(error);
  }
};

export default getPresignedUrl;
