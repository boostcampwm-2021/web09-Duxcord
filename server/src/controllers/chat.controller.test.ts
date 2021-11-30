import chatController from './chat.controller';
import { handleReactionMSG, createChatMSG } from '../messages';
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

  beforeEach(() => {
    jest.clearAllMocks();

    userRepository.findOne = jest.fn().mockResolvedValue('user');

    chatRepository.findOne = jest.fn().mockResolvedValue({
      id: 1,
      reactionsCount: 0,
      chattingChannel: { id: 1 },
      threadsCount: 0,
      threadWriter: 'user',
      threadLastTime: 0,
    });
  });

  describe('handleReaction', () => {
    const mockRequest = (value: boolean): Request => {
      const req = {
        isAuthenticated: jest.fn(() => value),
        session: {
          userID: 'banana',
        },
        params: {
          chatID: 1,
        },
      } as unknown;
      return req as Request;
    };

    context('reaction이 활성화 되어있지 않으면', () => {
      it('reaction을 생성하고 status 201 code를 반환한다', async () => {
        reactionRepository.findOne = jest.fn().mockResolvedValue(undefined);

        const req = mockRequest(true);
        const res = mockResponse('resolve');
        const next = jest.fn();
        const chat = await chatRepository.findOne();

        await chatController.handleReaction(req, res, next);

        expect(res.status).toBeCalledWith(201);
        expect(res.json).toBeCalledWith({
          chat,
          message: handleReactionMSG.addReactionSuccess,
        });
      });
    });

    context('reaction이 활성화 되어있으면', () => {
      it('reaction을 삭제하고 status 204 code를 반환한다', async () => {
        reactionRepository.findOne = jest.fn().mockResolvedValue('reaction');

        const req = mockRequest(true);
        const res = mockResponse('resolve');
        const next = jest.fn();
        const chat = await chatRepository.findOne();

        await chatController.handleReaction(req, res, next);

        expect(res.status).toBeCalledWith(204);
        expect(res.json).toBeCalledWith({
          chat,
          message: handleReactionMSG.deleteReactionSuccess,
        });
      });
    });

    context('user가 없을 때', () => {
      it('userNotFound 메시지를 반환한다', async () => {
        userRepository.findOne = jest.fn().mockResolvedValue(undefined);

        const req = mockRequest(true);
        const res = mockResponse('resolve');
        const next = jest.fn();

        await chatController.handleReaction(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(handleReactionMSG.userNotFound);
      });
    });

    context('chat이 없을 때', () => {
      it('chatNotFound 메시지를 반환한다', async () => {
        chatRepository.findOne = jest.fn().mockResolvedValue(undefined);

        const req = mockRequest(true);
        const res = mockResponse('resolve');
        const next = jest.fn();

        await chatController.handleReaction(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(handleReactionMSG.chatNotFound);
      });
    });

    context('error가 발생했을 때', () => {
      it('next가 실행된다', async () => {
        const req = mockRequest(true);
        const res = mockResponse('reject');
        const next = jest.fn();

        await chatController.handleReaction(req, res, next);

        expect(next).toBeCalled();
      });
    });
  });

  describe('createThread', () => {
    const mockRequest = (value: boolean, content: string): Request => {
      const req = {
        isAuthenticated: jest.fn(() => value),
        session: {
          userID: 'banana',
        },
        params: {
          chatID: 1,
        },
        body: {
          content,
        },
      } as unknown;
      return req as Request;
    };

    context('thread를 작성하면', () => {
      it('thread를 생성한다', async () => {
        const req = mockRequest(true, 'test');
        const res = mockResponse('resolve');
        const next = jest.fn();

        await chatController.createThread(req, res, next);

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

        await chatController.createThread(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(createChatMSG.userNotFound);
      });
    });

    context('chat이 없을 때', () => {
      it('chatNotFound 메시지를 반환한다', async () => {
        chatRepository.findOne = jest.fn().mockResolvedValue(undefined);

        const req = mockRequest(true, 'test');
        const res = mockResponse('resolve');
        const next = jest.fn();

        await chatController.createThread(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(createChatMSG.chatNotFound);
      });
    });

    context('content가 없을 때', () => {
      it('emptyChat 메시지를 반환한다', async () => {
        const req = mockRequest(true, '');
        const res = mockResponse('resolve');
        const next = jest.fn();

        await chatController.createThread(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(createChatMSG.emptyChat);
      });
    });

    context('error가 발생했을 때', () => {
      it('next가 실행된다', async () => {
        const req = mockRequest(true, 'test');
        const res = mockResponse('reject');
        const next = jest.fn();

        await chatController.createThread(req, res, next);

        expect(next).toBeCalled();
      });
    });
  });
  describe('getThread', () => {
    const mockRequest = (value: boolean): Request => {
      const req = {
        isAuthenticated: jest.fn(() => value),
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
        const req = mockRequest(true);
        const res = mockResponse('resolve');
        const next = jest.fn();
        const thread = await threadRepository.findThreadsByChatID('1');

        await chatController.getThread(req, res, next);

        expect(res.status).toBeCalledWith(200);
        expect(res.send).toBeCalledWith(thread);
      });
    });

    context('chat이 없을 때', () => {
      it('chatNotFound 메시지를 반환한다', async () => {
        chatRepository.findOne = jest.fn().mockResolvedValue(undefined);

        const req = mockRequest(true);
        const res = mockResponse('resolve');
        const next = jest.fn();

        await chatController.getThread(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(createChatMSG.chatNotFound);
      });
    });

    context('error가 발생했을 때', () => {
      it('next가 실행된다', async () => {
        const req = mockRequest(true);
        const res = mockResponse('reject');
        const next = jest.fn();

        await chatController.getThread(req, res, next);

        expect(next).toBeCalled();
      });
    });
  });
});
