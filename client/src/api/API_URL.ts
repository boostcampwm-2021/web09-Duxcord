export const API_URL = {
  user: {
    getGroups: '/api/user/groups',
    postJoinGroup: '/api/group/join',
  },
  channel: {
    postChat: (channelID: number) => `/api/channel/${channelID}/create`,
  },
};
