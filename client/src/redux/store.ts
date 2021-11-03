import { configureStore } from '@reduxjs/toolkit';
import selectedGroupReducer from './selectedGroup/slice';

const store = configureStore({ reducer: { selectedGroup: selectedGroupReducer } });

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
