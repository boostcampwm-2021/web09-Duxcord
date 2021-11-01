import reducer, {updateUserName} from './slice';

describe('slice', () => {
  describe('actions',() => {
    it('사용자의 이름을 업데이트 한다.',()=>{
      const initialState = {
        userName: '',
      };
      
      const state = reducer(initialState,updateUserName('Ducks!'))
      expect(state.userName).toBe('Ducks!');
      })
  })
})