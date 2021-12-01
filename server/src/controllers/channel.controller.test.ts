import channelController from './channel.controller';
import { CREATE_CHAT_MSG } from '../messages';
import { Request, Response } from 'express';

jest.mock('../loaders/orm.loader');
jest.mock('../utils');

describe('channel.controller', () => {
  const mockResponse = (): Response => {
    const res = {
      status: jest.fn((code) => res),
      json: jest.fn((value) => value),
      send: jest.fn((value) => value),
    } as unknown;
    return res as Response;
  };

  beforeEach(() => jest.clearAllMocks());

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

    context('정상적으로 값이 입력됐을 때', () => {
      it('chat을 반환한다', async () => {
        const req = mockRequest();
        const res = mockResponse();
        const next = jest.fn();

        await channelController.getChat(req, res, next);

        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalled();
      });
    });
  });

  describe('createChat', () => {
    const mockRequest = (): Request => {
      const req = {
        body: {
          content: 'test',
          files: [],
          user: { id: 1, thumbnail: null, username: 'banana' },
          chattingChannel: { id: 1 },
        },
      } as unknown;
      return req as Request;
    };

    context('정상적으로 값이 입력됐을 때', () => {
      it('chat을 생성한다', async () => {
        const req = mockRequest();
        const res = mockResponse();
        const next = jest.fn();

        await channelController.createChat(req, res, next);

        expect(res.status).toBeCalledWith(200);
        expect(res.send).toBeCalledWith(CREATE_CHAT_MSG.SUCCESS);
      });
    });
  });
});
