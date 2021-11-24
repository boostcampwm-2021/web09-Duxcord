import { postFetchOptions } from '../utils/fetchOptions';
import { API_URL } from '../api/API_URL';

const getPresignedUrl = async (uploadName: string) => {
  try {
    const response = await fetch(API_URL.user.getPresignedUrl, postFetchOptions({ uploadName }));
    const url = await response.json();
    return url;
  } catch (error) {
    console.log(error);
  }
};

export default getPresignedUrl;
