import { createSlice } from '@reduxjs/toolkit';

const initState = {
  loginID: '',
  username: '',
  thumbnail: null,
  bio: null,
};

const { reducer: selectedOtherUserReducer, actions } = createSlice({
  name: 'selectedOtherUser',
  initialState: initState,
  reducers: {
    setSelectedOtherUser: (state, { payload: { loginID, username, thumbnail, bio } }) => ({
      loginID,
      username,
      thumbnail,
      bio,
    }),
  },
});

export const { setSelectedOtherUser } = actions;

export default selectedOtherUserReducer;
