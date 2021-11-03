import { createSlice } from '@reduxjs/toolkit';

const initState = {
  type: '',
  id: null,
  name: '',
};

const { reducer: selectedChannelReducer, actions } = createSlice({
  name: 'selectedChannel',
  initialState: initState,
  reducers: {
    setSelectedChannel: (state, { payload: { type, id, name } }) => ({ type, id, name }),
  },
});

export const { setSelectedChannel } = actions;

export default selectedChannelReducer;