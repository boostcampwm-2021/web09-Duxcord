import { createSlice } from '@reduxjs/toolkit';

const initState = null;

const { reducer: selectedChatReducer, actions } = createSlice({
  name: 'selectedChannel',
  initialState: initState,
  reducers: {
    setSelectedChat: (state, { payload: chat }) => chat,
  },
});

export const { setSelectedChat } = actions;

export default selectedChatReducer;
