import { patchFetchOptions } from '@utils/fetchOptions';
import { API_URL } from './API_URL';

export const patchUserdata = ({
  username,
  thumbnail,
  bio,
}: {
  username: string;
  thumbnail: string | null;
  bio: string;
}) => fetch(API_URL.user.editProfile, patchFetchOptions({ username, thumbnail, bio }));
