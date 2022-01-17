import { createSlice } from '@reduxjs/toolkit';

interface SelectedChannel {
  type: ChannelType | '';
  id: number | null;
  name: string;
}

const initState: SelectedChannel = {
  type: '',
  id: null,
  name: '',
};

const { reducer: selectedChannelReducer, actions } = createSlice({
  name: 'selectedChannel',
  initialState: initState,
  reducers: {
    setSelectedChannel: (state, { payload: { type, id, name } }) => ({ type, id, name }),
    resetSelectedChannel: (state) => ({ ...initState }),
  },
});

export const { setSelectedChannel, resetSelectedChannel } = actions;

export default selectedChannelReducer;
