import { postFetchOptions } from '../utils/fetchOptions';
import { API_URL } from './API_URL';

export const postLikeChat = ({ chatID }: { chatID: number }) =>
  fetch(API_URL.channel.postLikeChat(chatID), postFetchOptions({}));
