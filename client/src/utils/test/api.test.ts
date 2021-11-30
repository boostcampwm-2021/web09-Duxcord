import { postSignIn, postSignUp } from '@api/index';

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
});
