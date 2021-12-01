import groupController from './group.controller';
import { Request, Response } from 'express';
import { GROUP_MSG } from '../messages';

jest.mock('../loaders/orm.loader');

import { groupMemberRepository, groupRepository } from '../loaders/orm.loader';

describe('group.controller', () => {
  const mockResponse = (): Response => {
    const res = {
      status: jest.fn((code) => res),
      json: jest.fn((value) => value),
    } as unknown;
    return res as Response;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createGroup', () => {
    const mockRequest = (): Request => {
      const req = {
        body: {
          groupName: 'test',
          groupThumbnail: null,
          leader: {
            loginID: 1,
          },
        },
      } as unknown;
      return req as Request;
    };

    context('정상적으로 값이 입력됐을 때', () => {
      it('group의 정보를 반환한다', async () => {
        const req = mockRequest();
        const res = mockResponse();
        const next = jest.fn();

        await groupController.createGroup(req, res, next);

        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalled();
      });
    });
  });

  describe('getGroupMembers', () => {
    const mockRequest = (): Request => {
      const req = {
        body: {
          group: { id: 1 },
        },
      } as unknown;
      return req as Request;
    };

    context('정상적으로 값이 입력됐을 때', () => {
      it('members를 반환한다', async () => {
        groupRepository.findOne = jest.fn().mockResolvedValue({ id: 1 });

        const req = mockRequest();
        const res = mockResponse();
        const next = jest.fn();
        const member = await groupMemberRepository.findUsersByGroupID(req.body.group.id);

        await groupController.getGroupMembers(req, res, next);

        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalledWith(member);
      });
    });
  });

  describe('createChannel', () => {
    const mockRequest = (channelType: 'chatting' | 'meeting'): Request => {
      const req = {
        body: {
          channelType,
          channelName: 'test',
          group: { id: 1 },
        },
      } as unknown;
      return req as Request;
    };

    context('정상적으로 값이 입력됐을 때 채널 타입이 chatting인 경우', () => {
      it('newChannel의 정보를 반환한다', async () => {
        const req = mockRequest('chatting');
        const res = mockResponse();
        const next = jest.fn();
        const newChannel = { group: { id: 1 }, name: 'test' };

        await groupController.createChannel(req, res, next);

        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalledWith(newChannel);
      });
    });

    context('정상적으로 값이 입력됐을 때 채널 타입이 meeting인 경우', () => {
      it('newChannel의 정보를 반환한다', async () => {
        const req = mockRequest('meeting');
        const res = mockResponse();
        const next = jest.fn();
        const newChannel = { group: { id: 1 }, name: 'test' };

        await groupController.createChannel(req, res, next);

        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalledWith(newChannel);
      });
    });
  });

  describe('joinGroup', () => {
    const mockRequest = (): Request => {
      const req = {
        body: {
          group: { id: 1 },
          user: 'test',
        },
      } as unknown;
      return req as Request;
    };

    context('정상적으로 값을 입력했을 때', () => {
      it('group의 정보를 반환한다', async () => {
        const req = mockRequest();
        const res = mockResponse();
        const next = jest.fn();
        const group = await groupRepository.findOne();

        await groupController.joinGroup(req, res, next);

        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalledWith(group);
      });
    });
  });

  describe('deleteGroup', () => {
    const mockRequest = (): Request => {
      const req = {
        body: {
          group: { id: 1 },
        },
      } as unknown;
      return req as Request;
    };

    context('정상적으로 값을 입력했을 때', () => {
      it('groupDeletionSuccess 메시지를 반환한다', async () => {
        const req = mockRequest();
        const res = mockResponse();
        const next = jest.fn();

        await groupController.deleteGroup(req, res, next);

        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalledWith(GROUP_MSG.GROUP_DELETION_SUCCESS);
      });
    });
  });

  describe('deleteChannel', () => {
    const mockRequest = (channelType: 'chatting' | 'meeting'): Request => {
      const req = {
        params: {
          channelType,
        },
        body: {
          channel: { id: 1 },
        },
      } as unknown;
      return req as Request;
    };

    context('정상적으로 값이 입력됐을 때 채널 타입이 chatting인 경우', () => {
      it('channelDeletionSuccess 메시지가 반환된다', async () => {
        const req = mockRequest('chatting');
        const res = mockResponse();
        const next = jest.fn();

        await groupController.deleteChannel(req, res, next);

        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalledWith(GROUP_MSG.CHANNEL_DELETION_SUCCESS);
      });
    });

    context('정상적으로 값이 입력됐을 때 채널 타입이 meeting인 경우', () => {
      it('channelDeletionSuccess 메시지가 반환된다', async () => {
        const req = mockRequest('meeting');
        const res = mockResponse();
        const next = jest.fn();

        await groupController.deleteChannel(req, res, next);

        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalledWith(GROUP_MSG.CHANNEL_DELETION_SUCCESS);
      });
    });
  });
});
