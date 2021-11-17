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

const { reducer: selectedOtherUserReducer, actions } = createSlice({
  name: 'selectedOtherUser',
  initialState: initState,
  reducers: {
    setSelectedOtherUser: (
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

export const { setSelectedOtherUser } = actions;

export default selectedOtherUserReducer;
