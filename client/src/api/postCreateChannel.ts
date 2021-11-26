import { postFetchOptions } from '@utils/fetchOptions';
import { API_URL } from '@utils/constants/API_URL';

export const postCreateChannel = ({
  groupID,
  channelType,
  channelName,
}: {
  groupID: number;
  channelType: 'chatting' | 'meeting';
  channelName: string;
}) =>
  fetch(API_URL.GROUP.POST_CREATE_CHANNEL(groupID), postFetchOptions({ channelType, channelName }));
