import reducer, { setSelectedGroup } from './slice';

describe('selectedChat slice', () => {
  describe('reducer', () => {
    it('setSelectedChat', () => {
      const initialState: any | null = null;
      const state: any = reducer(
        initialState,
        setSelectedGroup({
          groupCode: 'SLa209xk',
        }),
      );
      expect(state.groupCode).toBe('SLa209xk');
    });
  });
});
