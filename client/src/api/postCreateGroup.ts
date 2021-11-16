import { postFetchOptions } from '../utils/fetchOptions';
import { API_URL } from './API_URL';

export const postCreateGroup = ({ groupName }: { groupName: string }) =>
  fetch(API_URL.group.postCreateGroup, postFetchOptions({ groupName }));
