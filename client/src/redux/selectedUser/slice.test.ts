import reducer, { setSelectedUser } from './slice';

describe('selectedUser slice', () => {
  describe('reducer', () => {
    it('setSelectedChat', () => {
      const initialState = {
        id: '',
        loginID: '',
        username: '',
        thumbnail: null,
        bio: null,
        isOnline: false,
        isEditable: false,
      };

      const state: any = reducer(
        initialState,
        setSelectedUser({
          id: 1,
          loginID: 'tlsgyrms',
          username: '신효근',
          thumbnail: null,
          bio: null,
          isOnline: true,
          isEditable: false,
        }),
      );
      expect(state.username).toBe('신효근');
    });
  });
});
