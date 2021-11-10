import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export const useSelectedChat = () => useSelector((state: RootState) => state.selectedChat);
