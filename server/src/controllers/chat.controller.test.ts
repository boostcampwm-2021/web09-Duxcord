import chatController from './chat.controller';
import { HANDLE_REACTION_MSG, CREATE_CHAT_MSG } from '../messages';
import { Request, Response } from 'express';

jest.mock('../loaders/orm.loader');
jest.mock('../utils');

import {
  chatRepository,
  userRepository,
  threadRepository,
  reactionRepository,
} from '../loaders/orm.loader';

describe('chat.controller', () => {
  const mockResponse = (): Response => {
    const res = {
      status: jest.fn((code) => res),
      json: jest.fn((value) => value),
      send: jest.fn((value) => value),
    } as unknown;
    return res as Response;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleReaction', () => {
    const mockRequest = (): Request => {
      const req = {
        body: {
          user: 'banana',
          chat: { id: 1, reactionsCount: 0, chattingChannel: { id: 1 } },
        },
      } as unknown;
      return req as Request;
    };

    context('reaction이 활성화 되어있지 않으면', () => {
      it('reaction을 생성하고 status 201 code를 반환한다', async () => {
        reactionRepository.findOne = jest.fn().mockResolvedValue(undefined);

        const req = mockRequest();
        const res = mockResponse();
        const next = jest.fn();

        await chatController.handleReaction(req, res, next);

        expect(res.status).toBeCalledWith(201);
        expect(res.json).toBeCalled();
      });
    });

    context('reaction이 활성화 되어있으면', () => {
      it('reaction을 삭제하고 status 204 code를 반환한다', async () => {
        reactionRepository.findOne = jest.fn().mockResolvedValue('reaction');

        const req = mockRequest();
        const res = mockResponse();
        const next = jest.fn();

        await chatController.handleReaction(req, res, next);

        expect(res.status).toBeCalledWith(204);
        expect(res.json).toBeCalled();
      });
    });
  });

  describe('createThread', () => {
    const mockRequest = (): Request => {
      const req = {
        body: {
          chat: { id: 1, chattingChannel: { id: 1 } },
          content: 'test',
          user: 'banana',
        },
      } as unknown;
      return req as Request;
    };

    context('thread를 작성하면', () => {
      it('thread를 생성한다', async () => {
        const req = mockRequest();
        const res = mockResponse();
        const next = jest.fn();

        await chatController.createThread(req, res, next);

        expect(res.status).toBeCalledWith(200);
        expect(res.send).toBeCalledWith(CREATE_CHAT_MSG.SUCCESS);
      });
    });
  });

  describe('getThread', () => {
    const mockRequest = (): Request => {
      const req = {
        params: {
          chatID: 1,
        },
      } as unknown;
      return req as Request;
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    context('정상적인 값이 입력되면', () => {
      it('thread를 반환한다', async () => {
        const req = mockRequest();
        const res = mockResponse();
        const next = jest.fn();
        const thread = await threadRepository.findThreadsByChatID('1');

        await chatController.getThread(req, res, next);

        expect(res.status).toBeCalledWith(200);
        expect(res.send).toBeCalledWith(thread);
      });
    });
  });
});
