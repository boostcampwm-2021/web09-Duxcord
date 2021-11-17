import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';

export const useSelectedOtherUser = () =>
  useSelector((state: RootState) => state.selectedOtherUser);
