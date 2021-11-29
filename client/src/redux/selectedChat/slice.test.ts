import reducer, { setSelectedChat } from './slice';

describe('selectedChat slice', () => {
  describe('reducer', () => {
    it('setSelectedChat', () => {
      const initialState = null;
      const state: any = reducer(
        initialState,
        setSelectedChat({
          chatID: 1,
        }),
      );
      expect(state.chatID).toBe(1);
    });
  });
});
