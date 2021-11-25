import { postFetchOptions } from '@utils/fetchOptions';
import { API_URL } from './API_URL';

export const postCreateThread = ({ chatID, content }: { chatID: number; content: string }) =>
  fetch(API_URL.thread.createThread(chatID), postFetchOptions({ content }));
