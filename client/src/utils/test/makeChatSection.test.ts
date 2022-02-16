import { getDay, makeChatSection } from '../makeChatSection';

describe('makeChatSection', () => {
  it('getDayd에 Date형식을 예쁜 날짜형식으로 잘 나온다.', () => {
    const result = getDay('2021-11-22T09:52:41.185Z');
    expect(result).toBe('11월 22일 월요일');
    const result2 = getDay('2024-12-22T09:52:41.185Z');
    expect(result2).toBe('12월 22일 일요일');
  });

  it('chat의 배열을 makeChatSection을 통해서 날짜별로 그룹화 해준다.', () => {
    const chats: ChatData[][] = [
      [
        {
          id: 1,
          createdAt: '2024-12-21T09:52:41.185Z',
          updatedAt: '2024-12-21T09:52:41.185Z',
          content: '1',
          reactionsCount: 0,
          reactions: [],
          threadsCount: 0,
          threadWriter: null,
          threadLastTime: null,
          user: {
            loginID: 'shinhyogeun',
            username: '신효근',
          },
          files: [],
        },
        {
          id: 2,
          createdAt: '2024-12-22T09:52:41.185Z',
          updatedAt: '2024-12-22T09:52:41.185Z',
          content: '2',
          reactionsCount: 0,
          reactions: [],
          threadsCount: 0,
          threadWriter: null,
          threadLastTime: null,
          user: {
            loginID: 'shinhyogeun',
            username: '신효근',
          },
          files: [],
        },
        {
          id: 3,
          createdAt: '2024-12-22T09:52:41.185Z',
          updatedAt: '2024-12-22T09:52:41.185Z',
          content: '3',
          reactionsCount: 0,
          reactions: [],
          threadsCount: 0,
          threadWriter: null,
          threadLastTime: null,
          user: {
            loginID: 'shinhyogeun',
            username: '신효근',
          },
          files: [],
        },
      ],
    ];
    expect(makeChatSection(chats)['12월 22일 일요일'].length).toBe(2);
    expect(makeChatSection(chats)['12월 21일 토요일'].length).toBe(1);
  });
});
