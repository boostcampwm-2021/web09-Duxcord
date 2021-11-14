export const API_URL = {
  page: {
    loginPage: '/',
    groupPage: (groupID: number | undefined = undefined) =>
      groupID ? `/main?group=${groupID}` : '/main',
    ChannelPage: (groupID: number | undefined, channelType: string, id: number) =>
      `/main?group=${groupID}&type=${channelType}&id=${id}`,
  },
  user: {
    getUserdata: '/api/user',
    getGroups: '/api/user/groups',
    login: '/api/user/signin',
    logout: '/api/user/signout',
    signUp: '/api/user/signup',
  },
  channel: {
    postChat: (channelID: number) => `/api/channel/${channelID}/create`,
    postLikeChat: (chatID: number) => `/api/chat/${chatID}/reaction`,
    getKey: (channelID: number | null) => (index: number, prevData: any) => {
      if (prevData && !prevData.length) return null;
      return `/api/channel/${channelID}?page=${index + 1}`;
    },
  },
  group: {
    postJoinGroup: '/api/group/join',
    postCreateGroup: '/api/group/create',
    getGroupMembers: (groupID: number | undefined) => `/api/group/${groupID}/members`,
  },
  thread: {
    getThread: (chatID: number) => `/api/chat/${chatID}/thread`,
    createThread: (chatID: number) => `/api/chat/${chatID}/thread/create`,
  },
};
