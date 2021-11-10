export const API_URL = {
  user: {
    getUserdata: '/api/user',
    getGroups: '/api/user/groups',
  },
  channel: {
    postChat: (channelID: number) => `/api/channel/${channelID}/create`,
    postLikeChat: (chatID: number) => `/api/chat/${chatID}/reaction`,
  },
  group: {
    postJoinGroup: '/api/group/join',
    postCreateGroup: '/api/group/create',
  },
  thread: {
    getThread: (chatID: number) => `/api/chat/${chatID}/thread`,
    createThread: (chatID: number) => `/api/chat/${chatID}/thread/create`,
  },
};
