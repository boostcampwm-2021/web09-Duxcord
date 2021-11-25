import { postFetchOptions } from 'src/utils/fetchOptions';
import { API_URL } from '../utils/constraints/API_URL';

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
