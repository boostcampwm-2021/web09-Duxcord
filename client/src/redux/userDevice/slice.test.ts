import reducer, { setUserDevice, getInitState } from './slice';

describe('userDevice slice', () => {
  describe('reducer', () => {
    it('serUserDevice', () => {
      const initialState = getInitState();

      const state: any = reducer(
        initialState,
        setUserDevice({ mic: false, speaker: false, cam: false }),
      );
      expect(state.mic).toBe(false);
      expect(state.speaker).toBe(false);
      expect(state.cam).toBe(false);
    });
  });
});
