import reducer, { addToast, popToast } from './slice';
import { ToastData } from '@customTypes/toast';

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
  });
});
