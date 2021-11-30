import reducer, { setSelectedChat, resetSelectedChat } from './slice';

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

    it('resetSelectedChat', () => {
      const state: any = {
        chatID: 1,
      };
      const nextState: any = reducer(state, resetSelectedChat());
      expect(nextState).toBeNull();
    });
  });
});
