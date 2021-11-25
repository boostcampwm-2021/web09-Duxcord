<<<<<<< HEAD
import { patchFetchOptions } from 'src/utils/fetchOptions';
import { API_URL } from '../utils/constraints/API_URL';
=======
import { patchFetchOptions } from '@utils/fetchOptions';
import { API_URL } from './API_URL';
>>>>>>> dev

export const patchUserdata = ({
  username,
  thumbnail,
  bio,
}: {
  username: string;
  thumbnail: string | null;
  bio: string;
}) => fetch(API_URL.USER.POST_EDIT_PROFILE, patchFetchOptions({ username, thumbnail, bio }));
