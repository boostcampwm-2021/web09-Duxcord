export const API_URL = {
  user: {
    getGroups: '/api/user/groups',
  },
  channel: {
    postChat: (channelID: number) => `/api/channel/${channelID}/create`,
  },
};
