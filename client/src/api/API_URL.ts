export const API_URL = {
  user: {
    getUserdata: '/api/user',
    getGroups: '/api/user/groups',
    login: '/api/user/signin',
    logout: '/api/user/signout',
    signUp: '/api/user/signup',
    editProfile: '/api/user/profile',
    getOtherUserdata: (userID: string) => `/api/user/${userID}/profile`,
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
    postCreateChannel: (groupID: number | undefined) => `/api/group/${groupID}/channel/create`,
    getGroupMembers: (groupID: number | undefined) => `/api/group/${groupID}/members`,
    deleteGroup: (groupID: number | undefined) => `/api/group/${groupID}`,
    deleteChannel: (
      groupID: number | undefined,
      channelType: 'chatting' | 'meeting',
      channelID: number | undefined | null,
    ) => `/api/group/${groupID}/${channelType}/${channelID}`,
  },
  thread: {
    getThread: (chatID: number) => `/api/chat/${chatID}/thread`,
    createThread: (chatID: number) => `/api/chat/${chatID}/thread/create`,
  },
};
