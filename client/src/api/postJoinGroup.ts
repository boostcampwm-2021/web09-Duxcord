import { postFetchOptions } from '@utils/fetchOptions';
import { API_URL } from '@utils/constraints/API_URL';

export const postJoinGroup = ({ groupCode }: { groupCode: string }) =>
  fetch(API_URL.GROUP.POST_JOIN, postFetchOptions({ groupCode }));
