import { postFetchOptions } from '../utils/fetchOptions';
import { API_URL } from '../utils/constraints/API_URL';

export const postLikeChat = ({ chatID }: { chatID: number }) =>
  fetch(API_URL.CHANNEL.POST_CHAT_LIKE(chatID), postFetchOptions({}));
