import { Request, Response } from 'express';

jest.mock('../../loaders/orm.loader');

import { userRepository, chatRepository } from '../../loaders/orm.loader';
import { CREATE_CHAT_MSG, HANDLE_REACTION_MSG } from '../../messages';

import { chatValidator } from './index';

describe('chat.validator', () => {
  const mockResponse = (): Response => {
    const res = {} as unknown;
    return res as Response;
  };

  beforeEach(() => {
    jest.clearAllMocks();

    userRepository.findOne = jest.fn().mockResolvedValue('user');
    chatRepository.findOne = jest.fn().mockResolvedValue('chat');
  });

  describe('reactionValidator', () => {
    const mockRequest = (): Request => {
      const req = {
        session: {
          userID: 'banana',
        },
        params: {
          chatID: 1,
        },
        body: {},
      } as unknown;
      return req as Request;
    };

    context('user가 없을 때', () => {
      it('userNotFound 메시지를 반환한다', async () => {
        userRepository.findOne = jest.fn().mockResolvedValue(undefined);

        const req = mockRequest();
        const res = mockResponse();
        const next = jest.fn();

        await chatValidator.reactionValidator(req, res, next);

        expect(next).toBeCalledWith({ message: HANDLE_REACTION_MSG.USER_NOT_FOUND, status: 400 });
      });
    });

    context('chat이 없을 때', () => {
      it('chatNotFound 메시지를 반환한다', async () => {
        chatRepository.findOne = jest.fn().mockResolvedValue(undefined);

        const req = mockRequest();
        const res = mockResponse();
        const next = jest.fn();

        await chatValidator.reactionValidator(req, res, next);

        expect(next).toBeCalledWith({ message: HANDLE_REACTION_MSG.CHAT_NOT_FOUND, status: 400 });
      });
    });

    context('error가 발생하지 않았을 때', () => {
      it('next가 실행된다', async () => {
        const req = mockRequest();
        const res = mockResponse();
        const next = jest.fn();

        await chatValidator.reactionValidator(req, res, next);

        expect(next).toBeCalledWith();
      });
    });
  });

  describe('createThreadValidator', () => {
    const mockRequest = (content: string): Request => {
      const req = {
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

    context('user가 없을 때', () => {
      it('userNotFound 메시지를 반환한다', async () => {
        userRepository.findOne = jest.fn().mockResolvedValue(undefined);

        const req = mockRequest('test');
        const res = mockResponse();
        const next = jest.fn();

        await chatValidator.createThreadValidator(req, res, next);

        expect(next).toBeCalledWith({ message: CREATE_CHAT_MSG.USER_NOT_FOUND, status: 400 });
      });
    });

    context('chat이 없을 때', () => {
      it('chatNotFound 메시지를 반환한다', async () => {
        chatRepository.findOne = jest.fn().mockResolvedValue(undefined);

        const req = mockRequest('test');
        const res = mockResponse();
        const next = jest.fn();

        await chatValidator.createThreadValidator(req, res, next);

        expect(next).toBeCalledWith({ message: CREATE_CHAT_MSG.CHAT_NOT_FOUND, status: 400 });
      });
    });

    context('content가 없을 때', () => {
      it('emptyChat 메시지를 반환한다', async () => {
        const req = mockRequest('');
        const res = mockResponse();
        const next = jest.fn();

        await chatValidator.createThreadValidator(req, res, next);

        expect(next).toBeCalledWith({ message: CREATE_CHAT_MSG.EMPTY_CHAT, status: 400 });
      });
    });

    context('error가 발생하지 않았을 때', () => {
      it('next가 실행된다', async () => {
        const req = mockRequest('test');
        const res = mockResponse();
        const next = jest.fn();

        await chatValidator.createThreadValidator(req, res, next);

        expect(next).toBeCalledWith();
      });
    });
  });

  describe('getThreadValidator', () => {
    const mockRequest = (): Request => {
      const req = {
        params: {
          chatID: 1,
        },
      } as unknown;
      return req as Request;
    };

    context('chat이 없을 때', () => {
      it('chatNotFound 메시지를 반환한다', async () => {
        chatRepository.findOne = jest.fn().mockResolvedValue(undefined);

        const req = mockRequest();
        const res = mockResponse();
        const next = jest.fn();

        await chatValidator.getThreadValidator(req, res, next);

        expect(next).toBeCalledWith({ message: CREATE_CHAT_MSG.CHAT_NOT_FOUND, status: 400 });
      });
    });

    context('error가 발생하지 않았을 때', () => {
      it('next가 실행된다', async () => {
        const req = mockRequest();
        const res = mockResponse();
        const next = jest.fn();

        await chatValidator.getThreadValidator(req, res, next);

        expect(next).toBeCalledWith();
      });
    });
  });
});
