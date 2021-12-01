import { Request, Response } from 'express';
jest.mock('../../loaders/orm.loader');
import { userRepository, chatRepository } from '../../loaders/orm.loader';
import { createChatMSG, handleReactionMSG } from '../../messages';

import { createThreadValidator, getThreadValidator, reactionValidator } from './index';

describe('chat.validator', () => {
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

  describe('reactionValidator', () => {
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

    context('user가 없을 때', () => {
      it('userNotFound 메시지를 반환한다', async () => {
        userRepository.findOne = jest.fn().mockResolvedValue(undefined);

        const req = mockRequest(true);
        const res = mockResponse('resolve');
        const next = jest.fn();

        await reactionValidator(req, res, next);

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

        await reactionValidator(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(handleReactionMSG.chatNotFound);
      });
    });

    context('error가 발생했을 때', () => {
      it('next가 실행된다', async () => {
        const req = mockRequest(true);
        const res = mockResponse('reject');
        const next = jest.fn();

        await reactionValidator(req, res, next);

        expect(next).toBeCalled();
      });
    });
  });
  describe('createThreadValidator', () => {
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

    beforeEach(() => {
      jest.clearAllMocks();
    });

    context('user가 없을 때', () => {
      it('userNotFound 메시지를 반환한다', async () => {
        userRepository.findOne = jest.fn().mockResolvedValue(undefined);

        const req = mockRequest(true, 'test');
        const res = mockResponse('resolve');
        const next = jest.fn();

        await createThreadValidator(req, res, next);

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

        await createThreadValidator(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(createChatMSG.chatNotFound);
      });
    });

    context('content가 없을 때', () => {
      it('emptyChat 메시지를 반환한다', async () => {
        const req = mockRequest(true, '');
        const res = mockResponse('resolve');
        const next = jest.fn();

        await createThreadValidator(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(createChatMSG.emptyChat);
      });
    });

    context('error가 발생했을 때', () => {
      it('next가 실행된다', async () => {
        const req = mockRequest(true, 'test');
        const res = mockResponse('reject');
        const next = jest.fn();

        await createThreadValidator(req, res, next);

        expect(next).toBeCalled();
      });
    });
  });

  describe('getThreadValidator', () => {
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

    context('chat이 없을 때', () => {
      it('chatNotFound 메시지를 반환한다', async () => {
        chatRepository.findOne = jest.fn().mockResolvedValue(undefined);

        const req = mockRequest(true);
        const res = mockResponse('resolve');
        const next = jest.fn();

        await getThreadValidator(req, res, next);

        expect(res.status).toBeCalledWith(400);
        expect(res.send).toBeCalledWith(createChatMSG.chatNotFound);
      });
    });

    context('error가 발생했을 때', () => {
      it('next가 실행된다', async () => {
        const req = mockRequest(true);
        const res = mockResponse('reject');
        const next = jest.fn();

        await getThreadValidator(req, res, next);

        expect(next).toBeCalled();
      });
    });
  });
});
