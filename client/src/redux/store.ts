import { configureStore } from '@reduxjs/toolkit';
import groupConnectionReducer from './groupConnection/slice';
import selectedChannelReducer from './selectedChannel/slice';
import selectedGroupReducer from './selectedGroup/slice';
import userDeviceReducer from './userDevice/slice';

const store = configureStore({
  reducer: {
    selectedGroup: selectedGroupReducer,
    selectedChannel: selectedChannelReducer,
    userDevice: userDeviceReducer,
    groupConnection: groupConnectionReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
