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

    it('removeUserConnection', () => {
      const initialState: any | null = [{ loginID: 'a' }, { loginID: 'b' }, { loginID: 'c' }];
      const state = reducer(initialState, removeUserConnection({ loginID: 'b' }));
      expect(state.length).toBe(2);
    });

    it('addUserConnection', () => {
      const initialState: any | null = [{ loginID: 'a' }];
      const state = reducer(initialState, addUserConnection({ loginID: 'b' }));
      expect(state.length).toBe(2);
      const nextState = reducer(state, addUserConnection({ loginID: 'a' }));
      expect(nextState.length).toBe(2);
    });
  });
});
