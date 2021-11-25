import { postFetchOptions } from '@utils/fetchOptions';
import { API_URL } from './API_URL';

export const postChat = ({
  channelID,
  content,
  files,
}: {
  channelID: number;
  content: string | null;
  files: string[] | null;
}) => fetch(API_URL.channel.postChat(channelID), postFetchOptions({ content, files }));
