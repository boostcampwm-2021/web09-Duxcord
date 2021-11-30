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

export const createGroupValidator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createGroupData = new CreateGroupData(req.body);
    const errors = await validate(createGroupData, VALIDATE_OPTIONS);
    if (errors.length) return res.status(400).send(errors);
    const leaderID = req.session.userID;
    const leader = await userRepository.findOne({ where: { id: leaderID } });
    if (!leader) return res.status(400).send(GROUP_MSG.USER_NOT_FOUND);

    req.body.leader = leader;
    next();
  } catch (e) {
    next(e);
  }
};

export const groupIDValidator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const group = await groupRepository.findOne({ where: { id: id } });
    if (!group) return res.status(400).send(GROUP_MSG.GROUP_NOT_FOUND);

    req.body.group = group;
    next();
  } catch (e) {
    next(e);
  }
};

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

export const createChannelValidator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createChannelData = new CreateChannelData(req.body);
    const errors = await validate(createChannelData, VALIDATE_OPTIONS);
    if (errors.length) return res.status(400).json(errors);

    next();
  } catch (e) {
    next(e);
  }
};

export const joinGroupValidator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { groupCode } = req.body;
    const group = await groupRepository.findOne({
      where: { code: groupCode },
      relations: ['meetingChannels', 'chattingChannels'],
    });
    if (!group) return res.status(400).send(GROUP_MSG.GROUP_NOT_FOUND);

    const { userID } = req.session;
    const user = await userRepository.findOne({ where: { id: userID } });
    const relation = await groupMemberRepository
      .createQueryBuilder('group_member')
      .where('group_member.groupId = :groupID && group_member.userId = :userID', {
        groupID: group.id,
        userID: userID,
      })
      .getOne();
    if (relation) return res.status(400).send(GROUP_MSG.ALREADY_JOINED);

    req.body.group = group;
    req.body.user = user;
    next();
  } catch (e) {
    next(e);
  }
};

export const deleteGroupValidator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { userID } = req.session;
    const group = await groupRepository.findByIDWithLeaderID(id);
    if (!group) return res.status(400).send(GROUP_MSG.INVALID_GROUP_ID);
    if (group.leader.id !== userID)
      return res.status(400).send(GROUP_MSG.DONT_HAVE_AUTHORITY_TO_DELETE);

    req.body.group = group;
    next();
  } catch (e) {
    next(e);
  }
};

export const deleteChannelValidator = async (req: Request, res: Response, next: NextFunction) => {
  const { groupID, channelID, channelType } = req.params;
  const { userID } = req.session;

  try {
    const group = await groupRepository.findByIDWithLeaderID(groupID);

    if (!group) return res.status(400).send(GROUP_MSG.INVALID_GROUP_ID);
    if (group.leader.id !== userID)
      return res.status(400).send(GROUP_MSG.DONT_HAVE_AUTHORITY_TO_DELETE);
    if (!(channelType in ChannelType)) return res.status(400).send(GROUP_MSG.WRONG_CHANNEL_TYPE);

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
    if (!channel) return res.status(400).send(GROUP_MSG.INVALID_CHANNEL_ID);
    if (channel.group.id !== +groupID)
      return res.status(400).send(GROUP_MSG.CANT_FOUND_CHANNEL_IN_GROUP);

    req.body.channel = channel;
    next();
  } catch (e) {
    next(e);
  }
};
