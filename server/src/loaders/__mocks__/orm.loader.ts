export const chatRepository = {
  findChatsByPages: jest.fn(),
  save: jest.fn().mockResolvedValue('save'),
  findOne: jest.fn(),
};

export const userRepository = {
  findOne: jest.fn().mockResolvedValue('user'),
};

export const chattingChannelRepository = {
  findOne: jest.fn().mockResolvedValue('channel'),
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
  findThreadsByChatID: jest.fn(),
};
