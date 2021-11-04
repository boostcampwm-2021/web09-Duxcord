import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export const useSelectedChannel = () => useSelector((state: RootState) => state.selectedChannel);
