import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export const useSelectedGroup = () => {
  const selectedGroup = useSelector((state: RootState) => state.selectedGroup);

  return selectedGroup;
};
