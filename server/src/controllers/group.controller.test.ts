import groupController, { MSG } from './group.controller';
import { Request, Response } from 'express';

jest.mock('../loaders/orm.loader');

import {
  groupMemberRepository,
  groupRepository,
  chattingChannelRepository,
  userRepository,
} from '../loaders/orm.loader';

describe('group.controller', () => {
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

  describe('createGroup', () => {
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

    context('정상적으로 값이 입력됐을 때', () => {
      it('group의 정보를 반환한다', async () => {
        const req = mockRequest(true, 'test');
        const res = mockResponse('resolve');
        const next = jest.fn();

        const result = await groupController.createGroup(req, res, next);

        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalledWith(result);
      });
    });

    context('groupName이 없을 때', () => {
      it('needGroupName 메시지를 반환한다', async () => {
        const req = mockRequest(true, '');
        const res = mockResponse('resolve');
        const next = jest.fn();

        await groupController.createGroup(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(MSG.needGroupName);
      });
    });

    context('user가 없을 때', () => {
      it('userNotFound 메시지를 반환한다', async () => {
        userRepository.findOne = jest.fn().mockResolvedValue(undefined);

        const req = mockRequest(true, 'test');
        const res = mockResponse('resolve');
        const next = jest.fn();

        await groupController.createGroup(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(MSG.userNotFound);
      });
    });

    context('error가 발생했을 때', () => {
      it('next가 실행된다', async () => {
        const req = mockRequest(true, 'test');
        const res = mockResponse('reject');
        const next = jest.fn();

        await groupController.createGroup(req, res, next);

        expect(next).toBeCalled();
      });
    });
  });

  describe('getGroupMembers', () => {
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

    context('정상적으로 값이 입력됐을 때', () => {
      it('members를 반환한다', async () => {
        const req = mockRequest(true);
        const res = mockResponse('resolve');
        const next = jest.fn();
        const member = await groupMemberRepository.findUsersByGroupID(1);

        await groupController.getGroupMembers(req, res, next);

        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalledWith(member);
      });
    });

    context('group이 없을 때', () => {
      it('groupNotFound 메시지를 반환한다', async () => {
        groupRepository.findOne = jest.fn().mockResolvedValue(undefined);

        const req = mockRequest(true);
        const res = mockResponse('resolve');
        const next = jest.fn();

        await groupController.getGroupMembers(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(MSG.groupNotFound);
      });
    });

    context('error가 발생했을 때', () => {
      it('next가 실행된다', async () => {
        const req = mockRequest(true);
        const res = mockResponse('reject');
        const next = jest.fn();

        await groupController.getGroupMembers(req, res, next);

        expect(next).toBeCalled();
      });
    });
  });

  describe('createChannel', () => {
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

    context('정상적으로 값이 입력됐을 때', () => {
      it('newChannel의 정보를 반환한다', async () => {
        const req = mockRequest(true, 'chatting', 'test');
        const res = mockResponse('resolve');
        const next = jest.fn();
        const newChannel = { group: { id: 1 }, name: 'test' };

        await groupController.createChannel(req, res, next);

        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalledWith(newChannel);
      });
    });

    context('channelName이 없을 때', () => {
      it('channelNameEmpty 메시지가 반환된다', async () => {
        const req = mockRequest(true, 'chatting', '');
        const res = mockResponse('resolve');
        const next = jest.fn();

        await groupController.createChannel(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(MSG.channelNameEmpty);
      });
    });

    context('group이 없을 때', () => {
      it('groupNotFound 메시지를 반환한다', async () => {
        groupRepository.findOne = jest.fn().mockResolvedValue(undefined);

        const req = mockRequest(true, 'chatting', 'test');
        const res = mockResponse('resolve');
        const next = jest.fn();

        await groupController.createChannel(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(MSG.groupNotFound);
      });
    });

    context('channelType이 옳지 않을 때', () => {
      it('wrongChannelType 메시지가 반환된다', async () => {
        const req = mockRequest(true, 'test', 'test');
        const res = mockResponse('resolve');
        const next = jest.fn();

        await groupController.createChannel(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(MSG.wrongChannelType);
      });
    });

    context('error가 발생했을 때', () => {
      it('next가 실행된다', async () => {
        const req = mockRequest(true, 'chatting', 'test');
        const res = mockResponse('reject');
        const next = jest.fn();

        await groupController.createChannel(req, res, next);

        expect(next).toBeCalled();
      });
    });
  });

  describe('joinGroup', () => {
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

    context('정상적으로 값을 입력했을 때', () => {
      it('group의 정보를 반환한다', async () => {
        const req = mockRequest(true);
        const res = mockResponse('resolve');
        const next = jest.fn();
        const group = await groupRepository.findOne();

        await groupController.joinGroup(req, res, next);

        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalledWith(group);
      });
    });

    context('group이 없을 때', () => {
      it('groupNotFound 메시지를 반환한다', async () => {
        groupRepository.findOne = jest.fn().mockResolvedValue(undefined);

        const req = mockRequest(true);
        const res = mockResponse('resolve');
        const next = jest.fn();

        await groupController.joinGroup(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(MSG.groupNotFound);
      });
    });

    context('이미 가입한 그룹일 때', () => {
      it('alreadyJoined 메시지를 반환한다', async () => {
        groupMemberRepository.checkUserInGroup = jest.fn().mockResolvedValue('relation');
        const req = mockRequest(true);
        const res = mockResponse('resolve');
        const next = jest.fn();

        await groupController.joinGroup(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(MSG.alreadyJoined);
      });
    });

    context('error가 발생했을 때', () => {
      it('next가 실행된다', async () => {
        const req = mockRequest(true);
        const res = mockResponse('reject');
        const next = jest.fn();

        await groupController.joinGroup(req, res, next);

        expect(next).toBeCalled();
      });
    });
  });

  describe('deleteGroup', () => {
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

    context('정상적으로 값을 입력했을 때', () => {
      it('deleteGroup 메시지를 반환한다', async () => {
        const req = mockRequest(true);
        const res = mockResponse('resolve');
        const next = jest.fn();

        await groupController.deleteGroup(req, res, next);

        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalledWith(MSG.deleteGroup);
      });
    });

    context('group이 없을 때', () => {
      it('groupIDNotFound 메시지를 반환한다', async () => {
        groupRepository.findByIDWithLeaderID = jest.fn().mockResolvedValue(undefined);
        const req = mockRequest(true);
        const res = mockResponse('resolve');
        const next = jest.fn();

        await groupController.deleteGroup(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(MSG.groupIDNotFound);
      });
    });

    context('group의 leader가 아닐 때', () => {
      it('noGroupDeleteAuthorization 메시지를 반환한다', async () => {
        groupRepository.findByIDWithLeaderID = jest
          .fn()
          .mockResolvedValue({ id: 1, leader: { id: 2 } });
        const req = mockRequest(true);
        const res = mockResponse('resolve');
        const next = jest.fn();

        await groupController.deleteGroup(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(MSG.noGroupDeleteAuthorization);
      });
    });

    context('error가 발생했을 때', () => {
      it('next가 실행된다', async () => {
        const req = mockRequest(true);
        const res = mockResponse('reject');
        const next = jest.fn();

        await groupController.deleteGroup(req, res, next);

        expect(next).toBeCalled();
      });
    });
  });

  describe('deleteChannel', () => {
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

    context('정상적으로 값이 입력됐을 때', () => {
      it('deleteChannel 메시지가 반환된다', async () => {
        const req = mockRequest(true, '1', 'chatting');
        const res = mockResponse('resolve');
        const next = jest.fn();

        await groupController.deleteChannel(req, res, next);

        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalledWith(MSG.deleteChannel);
      });
    });

    context('group이 없을 때', () => {
      it('groupIDNotFound 메시지를 반환한다', async () => {
        groupRepository.findByIDWithLeaderID = jest.fn().mockResolvedValue(undefined);
        const req = mockRequest(true, '1', 'chatting');
        const res = mockResponse('resolve');
        const next = jest.fn();

        await groupController.deleteChannel(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(MSG.groupIDNotFound);
      });
    });

    context('group의 leader가 아닐 때', () => {
      it('noChannelDeleteAuthorization 메시지를 반환한다', async () => {
        groupRepository.findByIDWithLeaderID = jest
          .fn()
          .mockResolvedValue({ id: 1, leader: { id: 2 } });
        const req = mockRequest(true, '1', 'chatting');
        const res = mockResponse('resolve');
        const next = jest.fn();

        await groupController.deleteChannel(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(MSG.noChannelDeleteAuthorization);
      });
    });

    context('channelType이 옳지 않을 때', () => {
      it('wrongChannelType 메시지가 반환된다', async () => {
        const req = mockRequest(true, '1', 'test');
        const res = mockResponse('resolve');
        const next = jest.fn();

        await groupController.deleteChannel(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(MSG.wrongChannelType);
      });
    });

    context('channel이 없을 때', () => {
      it('channelIDNotFound 메시지가 반환된다', async () => {
        chattingChannelRepository.findOne = jest.fn().mockResolvedValue(undefined);

        const req = mockRequest(true, '1', 'chatting');
        const res = mockResponse('resolve');
        const next = jest.fn();

        await groupController.deleteChannel(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(MSG.channelIDNotFound);
      });
    });

    context('channel이 group에 존재하지 않을 때', () => {
      it('noChannelInGroup 메시지가 반환된다', async () => {
        chattingChannelRepository.findOne = jest.fn().mockResolvedValue({ group: { id: 2 } });

        const req = mockRequest(true, '1', 'chatting');
        const res = mockResponse('resolve');
        const next = jest.fn();

        await groupController.deleteChannel(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(MSG.noChannelInGroup);
      });
    });

    context('error가 발생했을 때', () => {
      it('next가 실행된다', async () => {
        const req = mockRequest(true, '1', 'chatting');
        const res = mockResponse('reject');
        const next = jest.fn();

        await groupController.deleteChannel(req, res, next);

        expect(next).toBeCalled();
      });
    });
  });
});
