import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';

export const useUserDevice = () => useSelector((state: RootState) => state.userDevice);
