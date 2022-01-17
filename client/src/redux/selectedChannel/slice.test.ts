import { CHANNEL_TYPE } from '@constants/CHANNEL_TYPE';
import reducer, { setSelectedChannel, resetSelectedChannel } from './slice';

describe('selectedChannel slice', () => {
  describe('reducer', () => {
    it('setSelectedChannel', () => {
      const initialState = {
        type: '' as '',
        id: null,
        name: '',
      };
      const state = reducer(
        initialState,
        setSelectedChannel({
          type: 'meetingChannel',
          id: 1,
          name: 'typeScript강의하는 곳',
        }),
      );
      expect(state.name).toBe('typeScript강의하는 곳');
    });

    it('resetSelectedChannel', () => {
      const state = {
        type: CHANNEL_TYPE.MEETING,
        id: null,
        name: 'typeScript강의하는 곳',
      };
      const initialState = reducer(state, resetSelectedChannel());
      expect(initialState.type).toBe('');
    });
  });
});
