import { createSlice } from '@reduxjs/toolkit';

const initState = 0;

const { reducer: selectedChatReducer, actions } = createSlice({
  name: 'selectedChannel',
  initialState: initState,
  reducers: {
    setSelectedChat: (state, { payload: chatID }) => chatID,
  },
});

export const { setSelectedChat } = actions;

export default selectedChatReducer;
