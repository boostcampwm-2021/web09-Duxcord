const API_URL = {
  USER: {
    GET_USERDATA: '/api/user',
    GET_GROUPS: '/api/user/groups',
    GET_OTHER_USER_DATA: (userID: string) => `/api/user/${userID}/profile`,
    GET_PRESIGNED_URL: '/api/user/presignedurl',
    POST_SIGN_IN: '/api/user/signin',
    POST_SIGN_OUT: '/api/user/signout',
    POST_SIGN_UP: '/api/user/signup',
    POST_EDIT_PROFILE: '/api/user/profile',
  },
  CHANNEL: {
    GET_BY_PAGE: (channelID: number | null) => (index: number, prevData: any) => {
      if (prevData && !prevData.length) return null;
      return `/api/channel/${channelID}?page=${index + 1}`;
    },
    POST_CHAT: (channelID: number) => `/api/channel/${channelID}/create`,
    POST_CHAT_LIKE: (chatID: number) => `/api/chat/${chatID}/reaction`,
  },
  GROUP: {
    GET_MEMBERS: (groupID: number | undefined) => `/api/group/${groupID}/members`,
    POST_JOIN: '/api/group/join',
    POST_CREATE_GROUP: '/api/group/create',
    POST_CREATE_CHANNEL: (groupID: number | undefined) => `/api/group/${groupID}/channel/create`,
    DELETE_GROUP: (groupID: number | undefined) => `/api/group/${groupID}`,
    DELETE_CHANNEL: (
      groupID: number | undefined,
      channelType: 'chatting' | 'meeting',
      channelID: number | undefined | null,
    ) => `/api/group/${groupID}/${channelType}/${channelID}`,
  },
  THREAD: {
    GET_DATA: (chatID: number) => `/api/chat/${chatID}/thread`,
    POST_CREATE: (chatID: number) => `/api/chat/${chatID}/thread/create`,
  },
};

export { API_URL };
