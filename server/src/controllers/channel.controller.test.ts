import channelController, { createChatMSG } from './channel.controller';
import { Request, Response } from 'express';

jest.mock('../loaders/orm.loader');
jest.mock('../utils');

import { chatRepository, userRepository } from '../loaders/orm.loader';

describe('channel.controller', () => {
  const mockResponse = (result: string): Response => {
    const res =
      result === 'resolve'
        ? ({
            status: jest.fn(() => res),
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

  describe('getChat', () => {
    const mockRequest = (): Request => {
      const req = {
        session: {
          userID: 'banana',
        },
        params: {
          chattingChannelID: 1,
        },
        query: { page: 1 },
      } as unknown;
      return req as Request;
    };

    beforeEach(() => jest.clearAllMocks());

    context('정상적으로 값이 입력됐을 때', () => {
      it('chat을 반환한다', async () => {
        chatRepository.findChatsByPages = jest.fn().mockResolvedValue('chat');

        const req = mockRequest();
        const res = mockResponse('resolve');
        const next = jest.fn();

        await channelController.getChat(req, res, next);

        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalled();
      });
    });

    context('error가 발생했을 때', () => {
      it('next가 실행된다', async () => {
        const req = mockRequest();
        const res = mockResponse('reject');
        const next = jest.fn();

        await channelController.getChat(req, res, next);

        expect(next).toBeCalled();
      });
    });
  });

  describe('createChat', () => {
    const mockRequest = (value: boolean, content: string): Request => {
      const req = {
        isAuthenticated: jest.fn(() => value),
        session: {
          userID: 'banana',
        },
        params: {
          chattingChannelID: 1,
        },
        body: {
          content,
          files: [],
        },
      } as unknown;
      return req as Request;
    };

    beforeEach(() => jest.clearAllMocks());

    context('정상적으로 값이 입력됐을 때', () => {
      it('chat을 생성한다', async () => {
        const req = mockRequest(true, 'test');
        const res = mockResponse('resolve');
        const next = jest.fn();

        await channelController.createChat(req, res, next);

        expect(res.status).toBeCalledWith(200);
        expect(res.send).toBeCalledWith(createChatMSG.success);
      });
    });

    context('user가 없을 때', () => {
      it('userNotFound 메시지를 반환한다', async () => {
        userRepository.findOne = jest.fn().mockResolvedValue(undefined);

        const req = mockRequest(true, 'test');
        const res = mockResponse('resolve');
        const next = jest.fn();

        await channelController.createChat(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(createChatMSG.userNotFound);
      });
    });

    context('content가 없을 때', () => {
      it('emptyChat 메시지를 반환한다', async () => {
        userRepository.findOne = jest.fn().mockResolvedValue('user');

        const req = mockRequest(true, '');
        const res = mockResponse('resolve');
        const next = jest.fn();

        await channelController.createChat(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(createChatMSG.emptyChat);
      });
    });

    context('error가 발생했을 때', () => {
      it('next가 실행된다', async () => {
        const req = mockRequest(true, 'test');
        const res = mockResponse('reject');
        const next = jest.fn();

        await channelController.createChat(req, res, next);

        expect(next).toBeCalled();
      });
    });
  });
});
