import groupController from './group.controller';
import { Request, Response } from 'express';
import { GROUP_MSG } from '../messages';

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
      it('channelDeletionSuccess 메시지를 반환한다', async () => {
        const req = mockRequest(true);
        const res = mockResponse('resolve');
        const next = jest.fn();

        await groupController.deleteGroup(req, res, next);

        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalledWith(GROUP_MSG.CHANNEL_DELETION_SUCCESS);
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
      it('channelDeletionSuccess 메시지가 반환된다', async () => {
        const req = mockRequest(true, '1', 'chatting');
        const res = mockResponse('resolve');
        const next = jest.fn();

        await groupController.deleteChannel(req, res, next);

        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalledWith(GROUP_MSG.CHANNEL_DELETION_SUCCESS);
      });
    });
  });
});
