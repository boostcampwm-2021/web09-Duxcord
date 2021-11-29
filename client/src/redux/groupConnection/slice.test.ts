import reducer, { setGroupConnection, removeUserConnection, addUserConnection } from './slice';

describe('groupConnection slice', () => {
  describe('reducer', () => {
    it('setGroupConnection', () => {
      const initialState: any | null = [];
      const state = reducer(
        initialState,
        setGroupConnection([{ user: '1' }, { user: '2' }, { user: '3' }]),
      );
      expect(state.length).toBe(3);
    });
  });
});
