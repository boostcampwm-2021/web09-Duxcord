export const chatRepository = {
  findChatsByPages: jest.fn().mockResolvedValue('chat'),
  save: jest.fn().mockResolvedValue('save'),
  findOne: jest.fn(),
};

export const userRepository = {
  findOne: jest.fn().mockResolvedValue('user'),
};

export const chattingChannelRepository = {
  findOne: jest.fn().mockResolvedValue('chattingChannel'),
  save: jest.fn().mockResolvedValue('save'),
  remove: jest.fn().mockResolvedValue('remove'),
};

export const fileRepository = {
  save: jest.fn().mockResolvedValue('file'),
};

export const reactionRepository = {
  findOne: jest.fn(),
  insert: jest.fn().mockResolvedValue('reactionInsert'),
  remove: jest.fn().mockResolvedValue('reactionRemove'),
};

export const threadRepository = {
  save: jest.fn().mockResolvedValue('save'),
  findThreadsByChatID: jest.fn((value) => Number(value)),
};

export const groupRepository = {
  findOne: jest.fn().mockResolvedValue({ id: 1 }),
  save: jest.fn().mockResolvedValue('save'),
  findByIDWithLeaderID: jest.fn(),
  remove: jest.fn().mockResolvedValue('remove'),
};

export const groupMemberRepository = {
  insert: jest.fn().mockResolvedValue('groupMemberInsert'),
  findUsersByGroupID: jest.fn((value) => value),
  checkUserInGroup: jest.fn(),
};

export const meetingChannelRepository = {
  save: jest.fn().mockResolvedValue('save'),
  findOne: jest.fn().mockResolvedValue('meetingChannel'),
  remove: jest.fn().mockResolvedValue('remove'),
};
