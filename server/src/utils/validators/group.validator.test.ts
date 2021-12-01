import { IsNotEmpty, Matches, validate } from 'class-validator';

import { Request, Response } from 'express';

jest.mock('../../loaders/orm.loader');

import {
  chattingChannelRepository,
  groupMemberRepository,
  groupRepository,
  userRepository,
} from '../../loaders/orm.loader';
import { GROUP_MSG } from '../../messages';
import { CreateGroupData, CreateChannelData, groupValidator } from './index';
import { ChannelType } from '../../types/ChannelType';
import { CatchError, CustomError } from '../CatchError';
import { REGEXP, VALIDATE_OPTIONS } from './utils';

describe('group.validator', () => {
  const mockResponse = (): Response => {
    const res = {} as unknown;
    return res as Response;
  };

  describe('createGroupValidator', () => {
    const mockRequest = (groupName: string): Request => {
      const req = {
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

    context('groupName이 없을 때', () => {
      it('needGroupName 메시지를 반환한다', async () => {
        const req = mockRequest('');
        const res = mockResponse();
        const next = jest.fn();
        const createGroupData = new CreateGroupData(req.body);
        const errors = await validate(createGroupData, VALIDATE_OPTIONS);

        await groupValidator.createGroupValidator(req, res, next);

        expect(next).toBeCalledWith({ message: errors, status: 400 });
      });
    });

    context('user가 없을 때', () => {
      it('userNotFound 메시지를 반환한다', async () => {
        userRepository.findOne = jest.fn().mockResolvedValue(undefined);

        const req = mockRequest('test');
        const res = mockResponse();
        const next = jest.fn();

        await groupValidator.createGroupValidator(req, res, next);

        expect(next).toBeCalledWith({ message: GROUP_MSG.USER_NOT_FOUND, status: 400 });
      });
    });

    context('error가 발생하지 않을 때', () => {
      it('next가 실행된다', async () => {
        const req = mockRequest('test');
        const res = mockResponse();
        const next = jest.fn();

        await groupValidator.createGroupValidator(req, res, next);

        expect(next).toBeCalledWith();
      });
    });
  });

  describe('groupIDValidator', () => {
    const mockRequest = (): Request => {
      const req = {
        params: {
          id: 1,
        },
        body: {},
      } as unknown;
      return req as Request;
    };

    beforeEach(() => {
      jest.clearAllMocks();

      groupRepository.findOne = jest.fn().mockResolvedValue({ id: 1 });
    });

    context('group이 없을 때', () => {
      it('groupNotFound 메시지를 반환한다', async () => {
        groupRepository.findOne = jest.fn().mockResolvedValue(undefined);

        const req = mockRequest();
        const res = mockResponse();
        const next = jest.fn();

        await groupValidator.groupIDValidator(req, res, next);

        expect(next).toBeCalledWith({ message: GROUP_MSG.GROUP_NOT_FOUND, status: 400 });
      });
    });

    context('error가 발생하지 않았을 때', () => {
      it('next가 실행된다', async () => {
        const req = mockRequest();
        const res = mockResponse();
        const next = jest.fn();

        await groupValidator.groupIDValidator(req, res, next);

        expect(next).toBeCalledWith();
      });
    });
  });

  describe('createChannelValidator', () => {
    const mockRequest = (channelType: string, channelName: string): Request => {
      const req = {
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

    context('channelName이 없을 때', () => {
      it('channelNameEmpty 메시지가 반환된다', async () => {
        const req = mockRequest('chatting', '');
        const res = mockResponse();
        const next = jest.fn();
        const createChannelData = new CreateChannelData(req.body);
        const errors = await validate(createChannelData, VALIDATE_OPTIONS);

        await groupValidator.createChannelValidator(req, res, next);

        expect(next).toBeCalledWith({ message: errors, status: 400 });
      });
    });

    context('channelType이 옳지 않을 때', () => {
      it('wrongChannelType 메시지가 반환된다', async () => {
        const req = mockRequest('test', 'test');
        const res = mockResponse();
        const next = jest.fn();
        const createChannelData = new CreateChannelData(req.body);
        const errors = await validate(createChannelData, VALIDATE_OPTIONS);

        await groupValidator.createChannelValidator(req, res, next);

        expect(next).toBeCalledWith({ message: errors, status: 400 });
      });
    });

    context('error가 발생하지 않았을 때', () => {
      it('next가 실행된다', async () => {
        const req = mockRequest('chatting', 'test');
        const res = mockResponse();
        const next = jest.fn();

        await groupValidator.createChannelValidator(req, res, next);

        expect(next).toBeCalledWith();
      });
    });
  });

  describe('joinGroupValidator', () => {
    const mockRequest = (): Request => {
      const req = {
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

    context('group이 없을 때', () => {
      it('groupNotFound 메시지를 반환한다', async () => {
        groupRepository.findOne = jest.fn().mockResolvedValue(undefined);

        const req = mockRequest();
        const res = mockResponse();
        const next = jest.fn();

        await groupValidator.joinGroupValidator(req, res, next);

        expect(next).toBeCalledWith({ message: GROUP_MSG.GROUP_NOT_FOUND, status: 400 });
      });
    });

    context('이미 가입한 그룹일 때', () => {
      it('alreadyJoined 메시지를 반환한다', async () => {
        groupMemberRepository.checkUserInGroup = jest.fn().mockResolvedValue('relation');

        const req = mockRequest();
        const res = mockResponse();
        const next = jest.fn();

        await groupValidator.joinGroupValidator(req, res, next);

        expect(next).toBeCalledWith({ message: GROUP_MSG.ALREADY_JOINED, status: 400 });
      });
    });

    context('error가 발생하지 않았을 때', () => {
      it('next가 실행된다', async () => {
        const req = mockRequest();
        const res = mockResponse();
        const next = jest.fn();

        await groupValidator.joinGroupValidator(req, res, next);

        expect(next).toBeCalledWith();
      });
    });
  });

  describe('deleteGroupValidator', () => {
    const mockRequest = (): Request => {
      const req = {
        session: {
          userID: 1,
        },
        params: {
          id: 1,
        },
        body: {},
      } as unknown;
      return req as Request;
    };

    beforeEach(() => {
      jest.clearAllMocks();

      groupRepository.findByIDWithLeaderID = jest
        .fn()
        .mockResolvedValue({ id: 1, leader: { id: 1 } });
    });

    context('group이 없을 때', () => {
      it('invalidGroupId 메시지를 반환한다', async () => {
        groupRepository.findByIDWithLeaderID = jest.fn().mockResolvedValue(undefined);
        const req = mockRequest();
        const res = mockResponse();
        const next = jest.fn();

        await groupValidator.deleteGroupValidator(req, res, next);

        expect(next).toBeCalledWith({ message: GROUP_MSG.INVALID_GROUP_ID, status: 400 });
      });
    });

    context('group의 leader가 아닐 때', () => {
      it('dontHaveAuthorityToDelete 메시지를 반환한다', async () => {
        groupRepository.findByIDWithLeaderID = jest
          .fn()
          .mockResolvedValue({ id: 1, leader: { id: 2 } });
        const req = mockRequest();
        const res = mockResponse();
        const next = jest.fn();

        await groupValidator.deleteGroupValidator(req, res, next);

        expect(next).toBeCalledWith({
          message: GROUP_MSG.DONT_HAVE_AUTHORITY_TO_DELETE,
          status: 400,
        });
      });
    });

    context('error가 발생하지 않았을 때', () => {
      it('next가 실행된다', async () => {
        const req = mockRequest();
        const res = mockResponse();
        const next = jest.fn();

        await groupValidator.deleteGroupValidator(req, res, next);

        expect(next).toBeCalledWith();
      });
    });
  });

  describe('deleteChannelValidator', () => {
    const mockRequest = (channelID: string, channelType: string): Request => {
      const req = {
        session: {
          userID: 1,
        },
        params: {
          groupID: '1',
          channelID,
          channelType,
        },
        body: {},
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

    context('group이 없을 때', () => {
      it('invalidGroupId 메시지를 반환한다', async () => {
        groupRepository.findByIDWithLeaderID = jest.fn().mockResolvedValue(undefined);
        const req = mockRequest('1', 'chatting');
        const res = mockResponse();
        const next = jest.fn();

        await groupValidator.deleteChannelValidator(req, res, next);

        expect(next).toBeCalledWith({ message: GROUP_MSG.INVALID_GROUP_ID, status: 400 });
      });
    });

    context('group의 leader가 아닐 때', () => {
      it('dontHaveAuthorityToDelete 메시지를 반환한다', async () => {
        groupRepository.findByIDWithLeaderID = jest
          .fn()
          .mockResolvedValue({ id: 1, leader: { id: 2 } });
        const req = mockRequest('1', 'chatting');
        const res = mockResponse();
        const next = jest.fn();

        await groupValidator.deleteChannelValidator(req, res, next);

        expect(next).toBeCalledWith({
          message: GROUP_MSG.DONT_HAVE_AUTHORITY_TO_DELETE,
          status: 400,
        });
      });
    });

    context('channelType이 옳지 않을 때', () => {
      it('wrongChannelType 메시지가 반환된다', async () => {
        const req = mockRequest('1', 'test');
        const res = mockResponse();
        const next = jest.fn();

        await groupValidator.deleteChannelValidator(req, res, next);

        expect(next).toBeCalledWith({ message: GROUP_MSG.WRONG_CHANNEL_TYPE, status: 400 });
      });
    });

    context('channel이 없을 때', () => {
      it('invalidChannelId 메시지가 반환된다', async () => {
        chattingChannelRepository.findOne = jest.fn().mockResolvedValue(undefined);

        const req = mockRequest('1', 'chatting');
        const res = mockResponse();
        const next = jest.fn();

        await groupValidator.deleteChannelValidator(req, res, next);

        expect(next).toBeCalledWith({ message: GROUP_MSG.INVALID_CHANNEL_ID, status: 400 });
      });
    });

    context('channel이 group에 존재하지 않을 때', () => {
      it('cantFoundChannelInGroup 메시지가 반환된다', async () => {
        chattingChannelRepository.findOne = jest.fn().mockResolvedValue({ group: { id: 2 } });

        const req = mockRequest('1', 'chatting');
        const res = mockResponse();
        const next = jest.fn();

        await groupValidator.deleteChannelValidator(req, res, next);

        expect(next).toBeCalledWith({
          message: GROUP_MSG.CANT_FOUND_CHANNEL_IN_GROUP,
          status: 400,
        });
      });
    });

    context('error가 발생하지 않았을 때', () => {
      it('next가 실행된다', async () => {
        const req = mockRequest('1', 'chatting');
        const res = mockResponse();
        const next = jest.fn();

        await groupValidator.deleteChannelValidator(req, res, next);

        expect(next).toBeCalledWith();
      });
    });
  });
});
