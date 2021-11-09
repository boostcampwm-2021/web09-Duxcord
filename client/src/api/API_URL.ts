export const API_URL = {
  user: {
    getUserdata: '/api/user',
    getGroups: '/api/user/groups',
  },
  channel: {
    postChat: (channelID: number) => `/api/channel/${channelID}/create`,
  },
  group: {
    postJoinGroup: '/api/group/join',
    postCreateGroup: '/api/group/create',
  },
};
