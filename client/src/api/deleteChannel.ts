import { deleteFetchOptions } from '../utils/fetchOptions';
import { API_URL } from './API_URL';

export const deleteChannel = ({
  groupID,
  channelType,
  channelID,
}: {
  groupID: number;
  channelType: 'chatting' | 'meeting';
  channelID?: number | null;
}) => fetch(API_URL.group.deleteChannel(groupID, channelType, channelID), deleteFetchOptions());
