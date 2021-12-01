import { IsNotEmpty, Matches, validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import {
  chattingChannelRepository,
  groupMemberRepository,
  groupRepository,
  meetingChannelRepository,
  userRepository,
} from '../../loaders/orm.loader';
import { GROUP_MSG } from '../../messages';
import { ChannelType } from '../../types/ChannelType';
import { CatchError, CustomError } from '../CatchError';
import { REGEXP, VALIDATE_OPTIONS } from './utils';

class CreateGroupData {
  constructor({ groupName, thumbnail }) {
    this.groupName = groupName;
    this.thumbnail = thumbnail;
  }

  @IsNotEmpty({ message: GROUP_MSG.NEED_GROUP_NAME })
  groupName: string;

  thumbnail: string | null;
}

class CreateChannelData {
  constructor({ channelName, channelType }) {
    this.channelName = channelName?.trim();
    this.channelType = channelType;
  }

  @IsNotEmpty({ message: GROUP_MSG.NEED_CHANNEL_NAME })
  channelName: string;

  @IsNotEmpty({ message: GROUP_MSG.NEED_CHANNEL_TYPE })
  @Matches(REGEXP.CHANNEL_TYPE, { message: GROUP_MSG.WRONG_CHANNEL_TYPE })
  channelType: ChannelType;
}

class GroupValidator {
  @CatchError
  async createGroupValidator(req: Request, res: Response, next: NextFunction) {
    const createGroupData = new CreateGroupData(req.body);
    const errors = await validate(createGroupData, VALIDATE_OPTIONS);
    if (errors.length) throw new CustomError({ message: errors, status: 400 });
    const leaderID = req.session.userID;
    const leader = await userRepository.findOne({ where: { id: leaderID } });
    if (!leader) throw new CustomError({ message: GROUP_MSG.USER_NOT_FOUND, status: 400 });

    req.body.leader = leader;
    next();
  }
  @CatchError
  async groupIDValidator(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const group = await groupRepository.findOne({ where: { id: id } });
    if (!group) throw new CustomError({ message: GROUP_MSG.GROUP_NOT_FOUND, status: 400 });

    req.body.group = group;
    next();
  }

  @CatchError
  async createChannelValidator(req: Request, res: Response, next: NextFunction) {
    const createChannelData = new CreateChannelData(req.body);
    const errors = await validate(createChannelData, VALIDATE_OPTIONS);
    if (errors.length) throw new CustomError({ message: errors, status: 400 });

    next();
  }

  @CatchError
  async joinGroupValidator(req: Request, res: Response, next: NextFunction) {
    const { groupCode } = req.body;
    const group = await groupRepository.findOne({
      where: { code: groupCode },
      relations: ['meetingChannels', 'chattingChannels'],
    });
    if (!group) throw new CustomError({ message: GROUP_MSG.GROUP_NOT_FOUND, status: 400 });

    const { userID } = req.session;
    const user = await userRepository.findOne({ where: { id: userID } });
    const relation = await groupMemberRepository
      .createQueryBuilder('group_member')
      .where('group_member.groupId = :groupID && group_member.userId = :userID', {
        groupID: group.id,
        userID: userID,
      })
      .getOne();
    if (relation) throw new CustomError({ message: GROUP_MSG.ALREADY_JOINED, status: 400 });

    req.body.group = group;
    req.body.user = user;
    next();
  }

  @CatchError
  async deleteGroupValidator(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { userID } = req.session;
    const group = await groupRepository.findByIDWithLeaderID(id);
    if (!group) throw new CustomError({ message: GROUP_MSG.INVALID_GROUP_ID, status: 400 });
    if (group.leader.id !== userID)
      throw new CustomError({ message: GROUP_MSG.DONT_HAVE_AUTHORITY_TO_DELETE, status: 400 });

    req.body.group = group;
    next();
  }

  @CatchError
  async deleteChannelValidator(req: Request, res: Response, next: NextFunction) {
    const { groupID, channelID, channelType } = req.params;
    const { userID } = req.session;

    const group = await groupRepository.findByIDWithLeaderID(groupID);

    if (!group) throw new CustomError({ message: GROUP_MSG.INVALID_GROUP_ID, status: 400 });
    if (group.leader.id !== userID)
      throw new CustomError({ message: GROUP_MSG.DONT_HAVE_AUTHORITY_TO_DELETE, status: 400 });
    if (!(channelType in ChannelType))
      throw new CustomError({ message: GROUP_MSG.WRONG_CHANNEL_TYPE, status: 400 });

    let channel;
    if (channelType === ChannelType.meeting) {
      channel = await meetingChannelRepository.findOne({
        where: { id: channelID },
        relations: ['group'],
      });
    } else {
      channel = await chattingChannelRepository.findOne({
        where: { id: channelID },
        relations: ['group'],
      });
    }
    if (!channel) throw new CustomError({ message: GROUP_MSG.INVALID_CHANNEL_ID, status: 400 });
    if (channel.group.id !== +groupID)
      throw new CustomError({ message: GROUP_MSG.CANT_FOUND_CHANNEL_IN_GROUP, status: 400 });

    req.body.channel = channel;
    next();
  }
}

const groupValidator = new GroupValidator();

export { groupValidator };
