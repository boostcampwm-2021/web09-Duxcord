import { createSlice } from '@reduxjs/toolkit';

const initState: any | null = [];

const { reducer: groupConnectionReducer, actions } = createSlice({
  name: 'selectedGroup',
  initialState: initState,
  reducers: {
    setGroupConnection: (state, { payload: group }) => {
      return [...group];
    },
    removeUserConnection: (state, { payload: connection }) => [
      ...state.filter((v: UserData) => v.loginID !== connection.loginID),
    ],
    addUserConnection: (state, { payload: connection }) => {
      if (state.some((v: UserData) => v.loginID === connection.loginID)) {
        return state;
      } else {
        return [...state, connection];
      }
    },
  },
});

export const { setGroupConnection, removeUserConnection, addUserConnection } = actions;

export default groupConnectionReducer;
