import { createSlice } from '@reduxjs/toolkit';

const initState: any | null = [];

const { reducer: groupConnectionReducer, actions } = createSlice({
  name: 'selectedGroup',
  initialState: initState,
  reducers: {
    setGroupConnection: (state, { payload: group }) => {
      // console.log('처음 받아오는 것', state, group);
      return [...group];
    },
    removeUserConnection: (state, { payload: connection }) => [
      ...state.filter((v: any) => v.loginID !== connection.loginID),
    ],
    addUserConnection: (state, { payload: connection }) => {
      // console.log(connection.loginID, '이 들어와서 redux가 실행된다.');
      if (state.map((v: any) => v.loginID).includes(connection.loginID)) {
        return state;
      } else {
        return [...state, connection];
      }
    },
  },
});

export const { setGroupConnection, removeUserConnection, addUserConnection } = actions;

export default groupConnectionReducer;
