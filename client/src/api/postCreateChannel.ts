import { postFetchOptions } from 'src/util/fetchOptions';
import { API_URL } from './API_URL';

export const postCreateChannel = ({
  groupID,
  channelType,
  channelName,
}: {
  groupID: number;
  channelType: 'chatting' | 'meeting';
  channelName: string;
}) =>
  fetch(API_URL.group.postCreateChannel(groupID), postFetchOptions({ channelType, channelName }));
