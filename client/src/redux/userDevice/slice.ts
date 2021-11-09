import { createSlice } from '@reduxjs/toolkit';

const initState: {mic: boolean, speaker: boolean, cam: boolean} = {
  mic: true,
  speaker: true,
  cam: true,
};

const { reducer: userDeviceReducer, actions } = createSlice({
  name: 'userDevice',
  initialState: initState,
  reducers: {
    setUserDevice: (state, { payload: { mic, speaker, cam } }) => ({ mic, speaker, cam }),
  },
});

export const { setUserDevice } = actions;

export default userDeviceReducer;
