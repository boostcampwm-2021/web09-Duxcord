import given from 'given2';

import { saveItem, loadItem } from '../storage';

describe('storage', () => {
  jest.spyOn(window.localStorage.__proto__, 'setItem');

  beforeEach(() => {
    window.localStorage.__proto__.setItem = jest.fn();
    window.localStorage.__proto__.getItem = jest.fn().mockImplementation(() => given.data);
    JSON.parse = jest.fn().mockImplementation(() => given.data);
  });

  describe('saveItem', () => {
    it('setItem을 호출한다.', () => {
      saveItem('key', {
        mic: true,
        speaker: true,
        cam: true,
      });

      expect(localStorage.setItem).toBeCalledWith(
        'key',
        JSON.stringify({
          mic: true,
          speaker: true,
          cam: true,
        }),
      );
    });
  });

  describe('loadItem', () => {
    context('key에 상응하는 data가 있을 때', () => {
      given('data', () => ({
        mic: true,
        speaker: true,
        cam: true,
      }));
      it('getItem을 호출하고 data를 반환한다.', () => {
        const item = loadItem('key');

        expect(localStorage.getItem).toBeCalledWith('key');
        expect(item).toEqual({
          mic: true,
          speaker: true,
          cam: true,
        });
      });
    });

    context('key에 상응하는 data가 없을 때', () => {
      given('data', () => null);
      it('getItem을 호출하고 null를 반환한다.', () => {
        const item = loadItem('key');

        expect(localStorage.getItem).toBeCalledWith('key');
        expect(item).toBe(null);
      });
    });
  });
});
