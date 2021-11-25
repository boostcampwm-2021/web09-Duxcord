import { deleteFetchOptions } from '../utils/fetchOptions';
import { API_URL } from '../utils/constraints/API_URL';

export const deleteChannel = ({
  groupID,
  channelType,
  channelID,
}: {
  groupID: number;
  channelType: 'chatting' | 'meeting';
  channelID?: number | null;
}) => fetch(API_URL.GROUP.DELETE_CHANNEL(groupID, channelType, channelID), deleteFetchOptions());
