import { postFetchOptions } from '../util/fetchOptions';
import { API_URL } from './API_URL';

export const postJoinGroup = ({ groupCode }: { groupCode: string }) =>
  fetch(API_URL.group.postJoinGroup, postFetchOptions({ groupCode }));
