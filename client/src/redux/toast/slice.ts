import { createSlice } from '@reduxjs/toolkit';

const initState = Array<ToastData>();

const { reducer: toastReducer, actions } = createSlice({
  name: 'toast',
  initialState: initState,
  reducers: {
    addToast: (state, { payload }) => [...state, payload],
    popToast: (state, { payload }) => state.filter((toast) => toast.id !== payload.id),
  },
});

export const { addToast, popToast } = actions;

export default toastReducer;
