import { postFetchOptions } from '@utils/fetchOptions';
import { API_URL } from './API_URL';

export const postCreateGroup = ({
  groupName,
  groupThumbnail,
}: {
  groupName: string;
  groupThumbnail: string | null;
}) => fetch(API_URL.group.postCreateGroup, postFetchOptions({ groupName, groupThumbnail }));
