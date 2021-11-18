import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';

export const useGroupConnection = () => useSelector((state: RootState) => state.groupConnection);
