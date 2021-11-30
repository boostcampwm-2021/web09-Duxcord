import { deleteFetchOptions } from '@api/fetchOptions';
import { API_URL } from '@utils/constants/API_URL';

export const deleteGroup = ({ groupID }: { groupID: number }) =>
  fetch(API_URL.GROUP.DELETE_GROUP(groupID), deleteFetchOptions());
