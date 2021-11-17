import { createSlice } from '@reduxjs/toolkit';

const initState = {
  id: '',
  loginID: '',
  username: '',
  thumbnail: null,
  bio: null,
  isOnline: false,
  isEditable: false,
};

const { reducer: selectedUserReducer, actions } = createSlice({
  name: 'selectedUser',
  initialState: initState,
  reducers: {
    setSelectedUser: (
      state,
      { payload: { id, loginID, username, thumbnail, bio, isOnline, isEditable } },
    ) => ({
      id,
      loginID,
      username,
      thumbnail,
      bio,
      isOnline,
      isEditable,
    }),
  },
});

export const { setSelectedUser } = actions;

export default selectedUserReducer;
