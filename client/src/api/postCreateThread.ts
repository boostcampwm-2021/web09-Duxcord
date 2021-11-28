import { postFetchOptions } from '@utils/fetchOptions';
import { API_URL } from '@utils/constants/API_URL';

export const postCreateThread = ({ chatID, content }: { chatID: number; content: string }) =>
  fetch(API_URL.THREAD.POST_CREATE(chatID), postFetchOptions({ content }));
