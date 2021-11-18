import { deleteFetchOptions } from '../utils/fetchOptions';
import { API_URL } from './API_URL';

export const deleteGroup = ({ groupID }: { groupID: number }) =>
  fetch(API_URL.group.deleteGroup(groupID), deleteFetchOptions());
