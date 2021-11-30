import { postFetchOptions } from '@api/fetchOptions';
import { API_URL } from '@utils/constants/API_URL';

export const postJoinGroup = ({ groupCode }: { groupCode: string }) =>
  fetch(API_URL.GROUP.POST_JOIN, postFetchOptions({ groupCode }));
