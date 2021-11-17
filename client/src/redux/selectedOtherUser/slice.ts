import { createSlice } from '@reduxjs/toolkit';

const initState = {
  id: '',
  loginID: '',
  username: '',
  thumbnail: null,
  bio: null,
  isOnline: false,
  canEdit: false,
};

const { reducer: selectedOtherUserReducer, actions } = createSlice({
  name: 'selectedOtherUser',
  initialState: initState,
  reducers: {
    setSelectedOtherUser: (
      state,
      { payload: { id, loginID, username, thumbnail, bio, isOnline, canEdit } },
    ) => ({
      id,
      loginID,
      username,
      thumbnail,
      bio,
      isOnline,
      canEdit,
    }),
  },
});

export const { setSelectedOtherUser } = actions;

export default selectedOtherUserReducer;
