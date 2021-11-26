import { postFetchOptions } from '@utils/fetchOptions';
import { API_URL } from '@utils/constraints/API_URL';

export const postChat = ({
  channelID,
  content,
  files,
}: {
  channelID: number;
  content: string | null;
  files: string[] | null;
}) => fetch(API_URL.CHANNEL.POST_CHAT(channelID), postFetchOptions({ content, files }));
