import {
  postSignIn,
  postSignUp,
  postLogout,
  deleteChannel,
  deleteGroup,
  getPresignedUrl,
  patchUserdata,
  postChat,
  postCreateChannel,
  postCreateGroup,
  postCreateThread,
  postJoinGroup,
  postLikeChat,
} from '@api/index';

describe('api', () => {
  const mockFetch = (data: string | undefined, body: any | undefined = undefined) => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      ok: true,
      text: async () => data,
      json: async () => {
        if (body) return body;
        if (data) return { data };
        throw Error();
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

  it('postLogout', async () => {
    mockFetch('성공적으로 로그아웃이 되었습니다.');
    const ok = await postLogout();
    expect(ok).toBeTruthy();
  });

  it('deleteChannel', async () => {
    mockFetch('성공적으로 채널이 지워졌습니다.');
    const { text } = await deleteChannel({ groupID: 1, channelType: 'meeting', channelID: 1 });
    const responseText = await text();
    expect(responseText).toBe('성공적으로 채널이 지워졌습니다.');
  });

  it('deleteGroup', async () => {
    mockFetch('성공적으로 그룹이 지워졌습니다.');
    const { text } = await deleteGroup({ groupID: 1 });
    const responseText = await text();
    expect(responseText).toBe('성공적으로 그룹이 지워졌습니다.');
  });

  context('getPresignedUrl 과정에서 에러가 발생하지 않았을 경우', () => {
    it('presignedUrl을 받는다.', async () => {
      mockFetch('http://presignedUrl');
      const { data } = await getPresignedUrl('uploadName');
      expect(data).toBe('http://presignedUrl');
    });
  });

  context('과정에서 에러가 발생했을 경우', () => {
    it('presignedUrl을 받지 못한다.', async () => {
      mockFetch('');
      const response = await getPresignedUrl('uploadName');
      expect(response).toBeUndefined();
    });
  });

  it('patchUserdata', async () => {
    const userData = {
      username: 'shinhyogeun',
      thumbnail: null,
      bio: '',
    };
    mockFetch('성공적으로 그룹이 지워졌습니다.', userData);
    const { json } = await patchUserdata(userData);
    const data = await json();
    expect(data).toEqual(userData);
  });

  it('postChat', async () => {
    const chatInfo: {
      channelID: number;
      content: string | null;
      files: string[] | null;
    } = {
      channelID: 1,
      content: '신효근',
      files: ['123', '123'],
    };
    mockFetch('성공적으로 채팅을 보냈습니다.', chatInfo);
    const { text } = await postChat(chatInfo);
    const data = await text();
    expect(data).toEqual('성공적으로 채팅을 보냈습니다.');
  });

  it('postCreateChannel', async () => {
    const channelInfo: {
      groupID: number;
      channelType: 'chatting' | 'meeting';
      channelName: string;
    } = {
      groupID: 1,
      channelType: 'chatting',
      channelName: '새로운 채널',
    };
    mockFetch('성공적으로 채널을 생성했습니다.', channelInfo);
    const { text } = await postCreateChannel(channelInfo);
    const data = await text();
    expect(data).toEqual('성공적으로 채널을 생성했습니다.');
  });

  it('postCreateGroup', async () => {
    mockFetch('성공적으로 그룹을 생성했습니다.');
    const { text } = await postCreateGroup({ groupName: 'Duxcord', groupThumbnail: null });
    const responseText = await text();
    expect(responseText).toBe('성공적으로 그룹을 생성했습니다.');
  });

  it('postCreateThread', async () => {
    mockFetch('성공적으로 쓰레드를 생성했습니다.');
    const { text } = await postCreateThread({ chatID: 1, content: '내용!' });
    const responseText = await text();
    expect(responseText).toBe('성공적으로 쓰레드를 생성했습니다.');
  });

  it('postJoinGroup', async () => {
    mockFetch('성공적으로 그룹에 가입하였습니다.');
    const { text } = await postJoinGroup({ groupCode: 'XXX' });
    const responseText = await text();
    expect(responseText).toBe('성공적으로 그룹에 가입하였습니다.');
  });

  it('postLikeChat', async () => {
    mockFetch('성공적으로 좋아요를 반영하였습니다.');
    const { text } = await postLikeChat({ chatID: 1 });
    const responseText = await text();
    expect(responseText).toBe('성공적으로 좋아요를 반영하였습니다.');
  });
});
