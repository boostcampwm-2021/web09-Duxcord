import { postSignIn, postSignUp, deleteChannel } from '@api/index';

describe('api', () => {
  const mockFetch = (data: string) => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      text: async () => {
        return data;
      },
    });
  };

  beforeEach(() => jest.clearAllMocks());

  it('tryLogin', async () => {
    mockFetch('성공적으로 로그인되었습니다.');
    const { status, responseText } = await postSignIn('shinhyogeun', '1234');
    expect(status).toBe(200);
    expect(responseText).toBe('성공적으로 로그인되었습니다.');
  });

  it('trySignUp', async () => {
    mockFetch('성공적으로 회원가입이 되었습니다.');
    const { status, responseText } = await postSignUp('tlsgyrms123', 'shinhyogeun', '1234');
    expect(status).toBe(200);
    expect(responseText).toBe('성공적으로 회원가입이 되었습니다.');
  });

  it('deleteChannel', async () => {
    mockFetch('성공적으로 채널이 지워졌습니다.');
    const { text } = await deleteChannel({ groupID: 1, channelType: 'meeting', channelID: 1 });
    const responseText = await text();
    expect(responseText).toBe('성공적으로 채널이 지워졌습니다.');
  });
});
