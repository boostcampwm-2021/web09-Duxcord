import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';

export const useSelectedGroup = () => useSelector((state: RootState) => state.selectedGroup);
