import { Request, Response } from 'express';

jest.mock('../../loaders/orm.loader');

import { chattingChannelRepository, userRepository } from '../../loaders/orm.loader';
import { CREATE_CHAT_MSG } from '../../messages';
import { channelValidator } from './index';

describe('channel.validator', () => {
  const mockResponse = (): Response => {
    const res = {} as unknown;
    return res as Response;
  };

  describe('createChatValidator', () => {
    const mockRequest = (content: string): Request => {
      const req = {
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

    beforeEach(() => {
      jest.clearAllMocks();
      userRepository.findOne = jest.fn().mockResolvedValue('user');
      chattingChannelRepository.findOne = jest.fn().mockResolvedValue('chattingChannel');
    });

    context('user가 없을 때', () => {
      it('userNotFound 메시지를 반환한다', async () => {
        userRepository.findOne = jest.fn().mockResolvedValue(undefined);

        const req = mockRequest('test');
        const res = mockResponse();
        const next = jest.fn();

        await channelValidator.createChatValidator(req, res, next);

        expect(next).toBeCalledWith({ message: CREATE_CHAT_MSG.USER_NOT_FOUND, status: 400 });
      });
    });

    context('content와 files가 없을 때', () => {
      it('emptyChat 메시지를 반환한다', async () => {
        const req = mockRequest('');
        const res = mockResponse();
        const next = jest.fn();

        await channelValidator.createChatValidator(req, res, next);

        expect(next).toBeCalledWith({ message: CREATE_CHAT_MSG.EMPTY_CHAT, status: 400 });
      });
    });

    context('chattingChannel이 없을 때', () => {
      it('channelNotFound 메시지를 반환한다', async () => {
        chattingChannelRepository.findOne = jest.fn().mockResolvedValue(undefined);

        const req = mockRequest('test');
        const res = mockResponse();
        const next = jest.fn();

        await channelValidator.createChatValidator(req, res, next);

        expect(next).toBeCalledWith({ message: CREATE_CHAT_MSG.CHANNEL_NOT_FOUND, status: 400 });
      });
    });

    context('error가 발생하지 않았을 때', () => {
      it('next가 실행된다', async () => {
        const req = mockRequest('test');
        const res = mockResponse();
        const next = jest.fn();

        await channelValidator.createChatValidator(req, res, next);

        expect(next).toBeCalledWith();
      });
    });
  });
});
