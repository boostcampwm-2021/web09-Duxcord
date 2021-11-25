<<<<<<< HEAD
import { deleteFetchOptions } from '../utils/fetchOptions';
import { API_URL } from '../utils/constraints/API_URL';
=======
import { deleteFetchOptions } from '@utils/fetchOptions';
import { API_URL } from './API_URL';
>>>>>>> dev

export const deleteChannel = ({
  groupID,
  channelType,
  channelID,
}: {
  groupID: number;
  channelType: 'chatting' | 'meeting';
  channelID?: number | null;
}) => fetch(API_URL.GROUP.DELETE_CHANNEL(groupID, channelType, channelID), deleteFetchOptions());
