import { createSlice } from '@reduxjs/toolkit';
import { loadItem, saveItem } from '@utils/storage';

const DEFAULT_INITSTATE: { mic: boolean; speaker: boolean; cam: boolean } = {
  mic: true,
  speaker: true,
  cam: true,
};

const getInitState = () => {
  const initState = loadItem('userDevice') ?? DEFAULT_INITSTATE;

  return initState;
};

const { reducer: userDeviceReducer, actions } = createSlice({
  name: 'userDevice',
  initialState: getInitState(),
  reducers: {
    setUserDevice: (state, { payload: { mic, speaker, cam } }) => {
      saveItem('userDevice', { mic, speaker, cam });
      return { mic, speaker, cam };
    },
  },
});

export const { setUserDevice } = actions;

export default userDeviceReducer;
