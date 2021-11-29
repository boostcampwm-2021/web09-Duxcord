import reducer, { resetSelectedGroup, setSelectedGroup } from './slice';

describe('selectedGroup slice', () => {
  describe('reducer', () => {
    it('setSelectedGroup', () => {
      const initialState: any | null = null;
      const state: any = reducer(
        initialState,
        setSelectedGroup({
          groupCode: 'SLa209xk',
        }),
      );
      expect(state.groupCode).toBe('SLa209xk');
    });

    it('resetSelectedGroup', () => {
      const state = {
        groupCode: 'SLa209xk',
      };
      const nextState: any = reducer(state, resetSelectedGroup());
      expect(nextState).toBeNull();
    });
  });
});
