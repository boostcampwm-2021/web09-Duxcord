import { getDay, makeChatSection } from '../makeChatSection';

describe('makeChatSection', () => {
  it('getDayd에 Date형식을 예쁜 날짜형식으로 잘 나온다.', () => {
    const result = getDay('2021-11-22T09:52:41.185Z');
    expect(result).toBe('11월 22일 월요일');
    const result2 = getDay('2024-12-22T09:52:41.185Z');
    expect(result2).toBe('12월 22일 일요일');
  });

  it('makeChatSection으로 통해서 날짜별로 그룹화 해준다.', () => {});
});
