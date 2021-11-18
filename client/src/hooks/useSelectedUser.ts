import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';

export const useSelectedUser = () => useSelector((state: RootState) => state.selectedUser);
