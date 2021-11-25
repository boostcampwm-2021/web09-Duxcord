<<<<<<< HEAD
import { postFetchOptions } from '../utils/fetchOptions';
import { API_URL } from '../utils/constraints/API_URL';
=======
import { postFetchOptions } from '@utils/fetchOptions';
import { API_URL } from './API_URL';
>>>>>>> dev

export const postChat = ({
  channelID,
  content,
  files,
}: {
  channelID: number;
  content: string | null;
  files: string[] | null;
}) => fetch(API_URL.CHANNEL.POST_CHAT(channelID), postFetchOptions({ content, files }));
