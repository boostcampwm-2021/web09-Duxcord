export const chatRepository = {
  findChatsByPages: jest.fn(),
  save: jest.fn().mockResolvedValue('save'),
  findOne: jest.fn().mockResolvedValue('chat'),
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
