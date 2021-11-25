<<<<<<< HEAD
import { deleteFetchOptions } from '../utils/fetchOptions';
import { API_URL } from '../utils/constraints/API_URL';
=======
import { deleteFetchOptions } from '@utils/fetchOptions';
import { API_URL } from './API_URL';
>>>>>>> dev

export const deleteGroup = ({ groupID }: { groupID: number }) =>
  fetch(API_URL.GROUP.DELETE_GROUP(groupID), deleteFetchOptions());
