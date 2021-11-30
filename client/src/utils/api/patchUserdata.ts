import { patchFetchOptions } from '@api/fetchOptions';
import { API_URL } from '@utils/constants/API_URL';

export const patchUserdata = ({
  username,
  thumbnail,
  bio,
}: {
  username: string;
  thumbnail: string | null;
  bio: string;
}) => fetch(API_URL.USER.POST_EDIT_PROFILE, patchFetchOptions({ username, thumbnail, bio }));
