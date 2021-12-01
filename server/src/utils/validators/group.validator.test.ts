import { Request, Response } from 'express';

jest.mock('../../loaders/orm.loader');

import {
  chattingChannelRepository,
  groupMemberRepository,
  groupRepository,
  userRepository,
} from '../../loaders/orm.loader';
import { GROUP_MSG } from '../../messages';
import {
  createGroupValidator,
  groupIDValidator,
  createChannelValidator,
  joinGroupValidator,
  deleteGroupValidator,
  deleteChannelValidator,
} from './index';

describe('group.validator', () => {
  const mockResponse = (result: string): Response => {
    const res =
      result === 'resolve'
        ? ({
            status: jest.fn((code) => res),
            json: jest.fn((value) => value),
            send: jest.fn((value) => value),
          } as unknown)
        : ({
            status: jest.fn((code) => res),
            json: jest.fn(() => {
              throw Error;
            }),
            send: jest.fn(() => {
              throw Error;
            }),
          } as unknown);
    return res as Response;
  };

  describe('createGroupValidator', () => {
    const mockRequest = (value: boolean, groupName: string): Request => {
      const req = {
        isAuthenticated: jest.fn(() => value),
        session: {
          userID: 1,
        },
        body: {
          groupName,
          groupThumbnail: null,
        },
      } as unknown;
      return req as Request;
    };

    beforeEach(() => {
      jest.clearAllMocks();

      userRepository.findOne = jest.fn().mockResolvedValue('user');
    });

    context('groupName이 없을 때', () => {
      it('needGroupName 메시지를 반환한다', async () => {
        const req = mockRequest(true, '');
        const res = mockResponse('resolve');
        const next = jest.fn();

        await createGroupValidator(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(GROUP_MSG.NEED_GROUP_NAME);
      });
    });

    context('user가 없을 때', () => {
      it('userNotFound 메시지를 반환한다', async () => {
        userRepository.findOne = jest.fn().mockResolvedValue(undefined);

        const req = mockRequest(true, 'test');
        const res = mockResponse('resolve');
        const next = jest.fn();

        await createGroupValidator(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(GROUP_MSG.USER_NOT_FOUND);
      });
    });

    context('error가 발생했을 때', () => {
      it('next가 실행된다', async () => {
        const req = mockRequest(true, 'test');
        const res = mockResponse('reject');
        const next = jest.fn();

        await createGroupValidator(req, res, next);

        expect(next).toBeCalled();
      });
    });
  });

  describe('groupIDValidator', () => {
    const mockRequest = (value: boolean): Request => {
      const req = {
        isAuthenticated: jest.fn(() => value),
        params: {
          id: 1,
        },
      } as unknown;
      return req as Request;
    };

    beforeEach(() => {
      jest.clearAllMocks();

      groupRepository.findOne = jest.fn().mockResolvedValue({ id: 1 });
    });

    context('group이 없을 때', () => {
      it('groupNotFound 메시지를 반환한다', async () => {
        groupRepository.findOne = jest.fn().mockResolvedValue(undefined);

        const req = mockRequest(true);
        const res = mockResponse('resolve');
        const next = jest.fn();

        await groupIDValidator(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(GROUP_MSG.GROUP_NOT_FOUND);
      });
    });

    context('error가 발생했을 때', () => {
      it('next가 실행된다', async () => {
        const req = mockRequest(true);
        const res = mockResponse('reject');
        const next = jest.fn();

        await groupIDValidator(req, res, next);

        expect(next).toBeCalled();
      });
    });
  });

  describe('createChannelValidator', () => {
    const mockRequest = (value: boolean, channelType: string, channelName: string): Request => {
      const req = {
        isAuthenticated: jest.fn(() => value),
        params: {
          id: 1,
        },
        body: {
          channelType,
          channelName,
        },
      } as unknown;
      return req as Request;
    };

    beforeEach(() => {
      jest.clearAllMocks();

      groupRepository.findOne = jest.fn().mockResolvedValue({ id: 1 });
    });
    context('channelName이 없을 때', () => {
      it('channelNameEmpty 메시지가 반환된다', async () => {
        const req = mockRequest(true, 'chatting', '');
        const res = mockResponse('resolve');
        const next = jest.fn();

        await createChannelValidator(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(GROUP_MSG.CHANNEL_NAME_EMPTY);
      });
    });
    context('channelType이 옳지 않을 때', () => {
      it('wrongChannelType 메시지가 반환된다', async () => {
        const req = mockRequest(true, 'test', 'test');
        const res = mockResponse('resolve');
        const next = jest.fn();

        await createChannelValidator(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(GROUP_MSG.WRONG_CHANNEL_TYPE);
      });
    });
    context('error가 발생했을 때', () => {
      it('next가 실행된다', async () => {
        const req = mockRequest(true, 'chatting', 'test');
        const res = mockResponse('reject');
        const next = jest.fn();

        await createChannelValidator(req, res, next);

        expect(next).toBeCalled();
      });
    });
  });

  describe('joinGroupValidator', () => {
    const mockRequest = (value: boolean): Request => {
      const req = {
        isAuthenticated: jest.fn(() => value),
        session: {
          userID: 1,
        },
        body: {
          groupCode: '123456',
        },
      } as unknown;
      return req as Request;
    };

    beforeEach(() => {
      jest.clearAllMocks();

      groupRepository.findOne = jest.fn().mockResolvedValue({ id: 1 });
      groupMemberRepository.checkUserInGroup = jest.fn();
    });

    context('group이 없을 때', () => {
      it('groupNotFound 메시지를 반환한다', async () => {
        groupRepository.findOne = jest.fn().mockResolvedValue(undefined);

        const req = mockRequest(true);
        const res = mockResponse('resolve');
        const next = jest.fn();

        await joinGroupValidator(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(GROUP_MSG.GROUP_NOT_FOUND);
      });
    });

    context('이미 가입한 그룹일 때', () => {
      it('alreadyJoined 메시지를 반환한다', async () => {
        groupMemberRepository.checkUserInGroup = jest.fn().mockResolvedValue('relation');
        const req = mockRequest(true);
        const res = mockResponse('resolve');
        const next = jest.fn();

        await joinGroupValidator(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(GROUP_MSG.ALREADY_JOINED);
      });
    });

    context('error가 발생했을 때', () => {
      it('next가 실행된다', async () => {
        const req = mockRequest(true);
        const res = mockResponse('reject');
        const next = jest.fn();

        await joinGroupValidator(req, res, next);

        expect(next).toBeCalled();
      });
    });
  });

  describe('deleteGroupValidator', () => {
    const mockRequest = (value: boolean): Request => {
      const req = {
        isAuthenticated: jest.fn(() => value),
        session: {
          userID: 1,
        },
        params: {
          id: 1,
        },
      } as unknown;
      return req as Request;
    };

    beforeEach(() => {
      jest.clearAllMocks();

      groupRepository.findByIDWithLeaderID = jest
        .fn()
        .mockResolvedValue({ id: 1, leader: { id: 1 } });
    });

    context('group이 없을 때', () => {
      it('invalidGroupId 메시지를 반환한다', async () => {
        groupRepository.findByIDWithLeaderID = jest.fn().mockResolvedValue(undefined);
        const req = mockRequest(true);
        const res = mockResponse('resolve');
        const next = jest.fn();

        await deleteGroupValidator(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(GROUP_MSG.INVALID_GROUP_ID);
      });
    });

    context('group의 leader가 아닐 때', () => {
      it('dontHaveAuthorityToDelete 메시지를 반환한다', async () => {
        groupRepository.findByIDWithLeaderID = jest
          .fn()
          .mockResolvedValue({ id: 1, leader: { id: 2 } });
        const req = mockRequest(true);
        const res = mockResponse('resolve');
        const next = jest.fn();

        await deleteGroupValidator(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(GROUP_MSG.DONT_HAVE_AUTHORITY_TO_DELETE);
      });
    });

    context('error가 발생했을 때', () => {
      it('next가 실행된다', async () => {
        const req = mockRequest(true);
        const res = mockResponse('reject');
        const next = jest.fn();

        await deleteGroupValidator(req, res, next);

        expect(next).toBeCalled();
      });
    });
  });

  describe('deleteChannelValidator', () => {
    const mockRequest = (value: boolean, channelID: string, channelType: string): Request => {
      const req = {
        isAuthenticated: jest.fn(() => value),
        session: {
          userID: 1,
        },
        params: {
          groupID: '1',
          channelID,
          channelType,
        },
      } as unknown;
      return req as Request;
    };

    beforeEach(() => {
      jest.clearAllMocks();

      groupRepository.findByIDWithLeaderID = jest
        .fn()
        .mockResolvedValue({ id: 1, leader: { id: 1 } });

      chattingChannelRepository.findOne = jest.fn().mockResolvedValue({ group: { id: 1 } });
    });

    context('group이 없을 때', () => {
      it('invalidGroupId 메시지를 반환한다', async () => {
        groupRepository.findByIDWithLeaderID = jest.fn().mockResolvedValue(undefined);
        const req = mockRequest(true, '1', 'chatting');
        const res = mockResponse('resolve');
        const next = jest.fn();

        await deleteChannelValidator(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(GROUP_MSG.INVALID_GROUP_ID);
      });
    });

    context('group의 leader가 아닐 때', () => {
      it('dontHaveAuthorityToDelete 메시지를 반환한다', async () => {
        groupRepository.findByIDWithLeaderID = jest
          .fn()
          .mockResolvedValue({ id: 1, leader: { id: 2 } });
        const req = mockRequest(true, '1', 'chatting');
        const res = mockResponse('resolve');
        const next = jest.fn();

        await deleteChannelValidator(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(GROUP_MSG.DONT_HAVE_AUTHORITY_TO_DELETE);
      });
    });

    context('channelType이 옳지 않을 때', () => {
      it('wrongChannelType 메시지가 반환된다', async () => {
        const req = mockRequest(true, '1', 'test');
        const res = mockResponse('resolve');
        const next = jest.fn();

        await deleteChannelValidator(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(GROUP_MSG.WRONG_CHANNEL_TYPE);
      });
    });

    context('channel이 없을 때', () => {
      it('invalidChannelId 메시지가 반환된다', async () => {
        chattingChannelRepository.findOne = jest.fn().mockResolvedValue(undefined);

        const req = mockRequest(true, '1', 'chatting');
        const res = mockResponse('resolve');
        const next = jest.fn();

        await deleteChannelValidator(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(GROUP_MSG.INVALID_CHANNEL_ID);
      });
    });

    context('channel이 group에 존재하지 않을 때', () => {
      it('cantFoundChannelInGroup 메시지가 반환된다', async () => {
        chattingChannelRepository.findOne = jest.fn().mockResolvedValue({ group: { id: 2 } });

        const req = mockRequest(true, '1', 'chatting');
        const res = mockResponse('resolve');
        const next = jest.fn();

        await deleteChannelValidator(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(GROUP_MSG.CANT_FOUND_CHANNEL_IN_GROUP);
      });
    });

    context('error가 발생했을 때', () => {
      it('next가 실행된다', async () => {
        const req = mockRequest(true, '1', 'chatting');
        const res = mockResponse('reject');
        const next = jest.fn();

        await deleteChannelValidator(req, res, next);

        expect(next).toBeCalled();
      });
    });
  });
});
