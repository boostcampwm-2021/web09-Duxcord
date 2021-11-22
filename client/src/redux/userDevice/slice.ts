import { createSlice } from '@reduxjs/toolkit';
import { loadItem, saveItem } from 'src/utils/storage';

const initState: { mic: boolean; speaker: boolean; cam: boolean } = {
  mic: true,
  speaker: true,
  cam: true,
};

const { reducer: userDeviceReducer, actions } = createSlice({
  name: 'userDevice',
  initialState: initState,
  reducers: {
    setUserDevice: (state, { payload: { mic, speaker, cam } }) => {
      saveItem('userDevice', { mic, speaker, cam });
      return { mic, speaker, cam };
    },
    bringUserDevice: (state) => {
      const userDevice = loadItem('userDevice');
      return userDevice ? { ...JSON.parse(userDevice) } : { ...initState };
    },
  },
});

export const { setUserDevice, bringUserDevice } = actions;

export default userDeviceReducer;
