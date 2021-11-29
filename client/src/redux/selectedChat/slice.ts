import { createSlice } from '@reduxjs/toolkit';

const initState = null;

const { reducer: selectedChatReducer, actions } = createSlice({
  name: 'selectedChannel',
  initialState: initState,
  reducers: {
    setSelectedChat: (state, { payload: chat }) => chat,
    resetSelectedChat: (state) => initState,
  },
});

export const { setSelectedChat, resetSelectedChat } = actions;

export default selectedChatReducer;
