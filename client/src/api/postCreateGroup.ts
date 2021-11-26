import { postFetchOptions } from '@utils/fetchOptions';
import { API_URL } from '@utils/constraints/API_URL';

export const postCreateGroup = ({
  groupName,
  groupThumbnail,
}: {
  groupName: string;
  groupThumbnail: string | null;
}) => fetch(API_URL.GROUP.POST_CREATE_GROUP, postFetchOptions({ groupName, groupThumbnail }));
