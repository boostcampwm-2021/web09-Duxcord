import reducer, { addToast, popToast } from './slice';

describe('toast slice', () => {
  describe('reducer', () => {
    it('addToast', () => {
      const initialState = Array<ToastData>();

      const state: any = reducer(
        initialState,
        addToast({
          message: 'message',
          type: 'success',
          duration: 5,
          id: '1',
        }),
      );
      expect(state.length).toBe(1);
    });

    it('popToast', () => {
      const initialState: Array<ToastData> = [
        {
          message: 'message',
          type: 'success',
          duration: 5,
          id: '1',
        },
      ];

      const state: any = reducer(
        initialState,
        popToast({
          message: 'message',
          type: 'success',
          duration: 5,
          id: '1',
        }),
      );
      expect(state.length).toBe(0);
    });
  });
});
