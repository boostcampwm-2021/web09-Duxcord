import { configureStore } from '@reduxjs/toolkit';
import selectedChannelReducer from './selectedChannel/slice';
import selectedGroupReducer from './selectedGroup/slice';

const store = configureStore({
  reducer: { selectedGroup: selectedGroupReducer, selectedChannel: selectedChannelReducer },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
