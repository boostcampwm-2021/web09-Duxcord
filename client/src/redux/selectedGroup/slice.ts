import { createSlice } from '@reduxjs/toolkit';

const initState: any | null = null;

const { reducer: selectedGroupReducer, actions } = createSlice({
  name: 'selectedGroup',
  initialState: initState,
  reducers: {
    setSelectedGroup: (state, { payload: group }) => ({ ...group }),
    resetSelectedGroup: (state) => initState,
  },
});

export const { setSelectedGroup, resetSelectedGroup } = actions;

export default selectedGroupReducer;
