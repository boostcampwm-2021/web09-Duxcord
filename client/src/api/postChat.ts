import { postFetchOptions } from '../utils/fetchOptions';
import { API_URL } from './API_URL';

export const postChat = ({ channelID, content }: { channelID: number; content: string }) =>
  fetch(API_URL.channel.postChat(channelID), postFetchOptions({ content }));
