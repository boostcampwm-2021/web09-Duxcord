import { NextFunction, Request, Response } from 'express';

import {
  groupMemberRepository,
  groupRepository,
  meetingChannelRepository,
  chattingChannelRepository,
  userRepository,
} from '../loaders/orm.loader';
import { ChattingChannel, MeetingChannel, Workgroup } from '../db/entities';
import { ChannelType } from '../types/ChannelType';
import { GROUP_MSG } from '../messages';

const nullCheck = (data) => data !== undefined && data !== null && data !== '';
const encodeBase64 = (str: string): string => Buffer.from(str, 'binary').toString('base64');

const DEFAULT_CHANNEL_NAME = 'general';

const createGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { groupName, groupThumbnail } = req.body;
  try {
    if (!nullCheck(groupName)) return res.status(400).send(GROUP_MSG.NEED_GROUP_NAME);
    const leaderID = req.session.userID;
    const leader = await userRepository.findOne({ where: { id: leaderID } });
    if (!leader) return res.status(400).send(GROUP_MSG.USER_NOT_FOUND);

    const newGroup = new Workgroup();
    newGroup.name = groupName;
    newGroup.leader = leader;
    newGroup.thumbnail = groupThumbnail;

    const now = new Date();
    const timestamp = now.getTime();
    const newCode = encodeBase64(String(timestamp).slice(-6));
    newGroup.code = newCode;
    await groupRepository.save(newGroup);

    await groupMemberRepository.insert({ group: newGroup, user: leader, lastAccessTime: now });

    const newMeetingChannel = new MeetingChannel();
    newMeetingChannel.group = newGroup;
    newMeetingChannel.name = DEFAULT_CHANNEL_NAME;
    await meetingChannelRepository.save(newMeetingChannel);
    const responseMeetingChannel = (({ group, ...o }) => o)(newMeetingChannel);

    const newChattingChannel = new ChattingChannel();
    newChattingChannel.group = newGroup;
    newChattingChannel.name = DEFAULT_CHANNEL_NAME;
    await chattingChannelRepository.save(newChattingChannel);
    const responseChattingChannel = (({ group, ...o }) => o)(newChattingChannel);

    const responseGroup = {
      id: newGroup.id,
      name: newGroup.name,
      code: newCode,
      thumbnail: newGroup.thumbnail,
      meetingChannels: [responseMeetingChannel],
      chattingChannels: [responseChattingChannel],
      leader: { loginID: leader.loginID },
    };

    return res.status(200).json(responseGroup);
  } catch (error) {
    next(error);
  }
};

const getGroupMembers = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const group = await groupRepository.findOne({ where: { id: id } });
    if (!group) return res.status(400).send(GROUP_MSG.GROUP_NOT_FOUND);

    const members = await groupMemberRepository.findUsersByGroupID(group.id);

    res.status(200).json(members);
  } catch (error) {
    next(error);
  }
};

const createChannel = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { channelType, channelName } = req.body;

  try {
    if (!channelName || !channelName.trim())
      return res.status(400).send(GROUP_MSG.CHANNEL_NAME_EMPTY);
    const group = await groupRepository.findOne({ where: { id: id } });
    if (!group) return res.status(400).send(GROUP_MSG.GROUP_NOT_FOUND);
    if (!Object.values(ChannelType).includes(channelType))
      return res.status(400).send(GROUP_MSG.WRONG_CHANNEL_TYPE);

    const newChannel =
      channelType === ChannelType.chatting ? new ChattingChannel() : new MeetingChannel();
    newChannel.name = channelName;
    newChannel.group = group;

    channelType === ChannelType.chatting
      ? await chattingChannelRepository.save(newChannel)
      : await meetingChannelRepository.save(newChannel);

    return res.status(200).json(newChannel);
  } catch (error) {
    next(error);
  }
};

const joinGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { groupCode } = req.body;

  try {
    const { userID } = req.session;
    const user = await userRepository.findOne({ where: { id: userID } });
    const group = await groupRepository.findOne({
      where: { code: groupCode },
      relations: ['meetingChannels', 'chattingChannels'],
    });
    if (!group) return res.status(400).send(GROUP_MSG.GROUP_NOT_FOUND);

    const relation = await groupMemberRepository
      .createQueryBuilder('group_member')
      .where('group_member.groupId = :groupID && group_member.userId = :userID', {
        groupID: group.id,
        userID: userID,
      })
      .getOne();

    if (relation) return res.status(400).send(GROUP_MSG.ALREADY_JOINED);

    const now = new Date();
    await groupMemberRepository.insert({ group: group, user: user, lastAccessTime: now });

    res.status(200).json(group);
  } catch (error) {
    next(error);
  }
};

const deleteGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { userID } = req.session;

  try {
    const group = await groupRepository.findByIDWithLeaderID(id);

    if (!group) return res.status(400).send(GROUP_MSG.INVALID_GROUP_ID);
    if (group.leader.id !== userID)
      return res.status(400).send(GROUP_MSG.DONT_HAVE_AUTHORITY_TO_DELETE);

    await groupRepository.remove(group);
    res.status(200).json(GROUP_MSG.GROUP_DELETION_SUCCESS);
  } catch (error) {
    next(error);
  }
};

const deleteChannel = async (req: Request, res: Response, next: NextFunction) => {
  const { groupID, channelID, channelType } = req.params;
  const { userID } = req.session;

  try {
    const group = await groupRepository.findByIDWithLeaderID(groupID);

    if (!group) return res.status(400).send(GROUP_MSG.INVALID_GROUP_ID);
    if (group.leader.id !== userID)
      return res.status(400).send(GROUP_MSG.DONT_HAVE_AUTHORITY_TO_DELETE);
    if (!['meeting', 'chatting'].includes(channelType))
      return res.status(400).send(GROUP_MSG.WRONG_CHANNEL_TYPE);

    if (channelType === 'meeting') {
      const channel = await meetingChannelRepository.findOne({
        where: { id: channelID },
        relations: ['group'],
      });
      if (!channel) return res.status(400).send(GROUP_MSG.INVALID_CHANNEL_ID);
      if (channel.group.id.toString() !== groupID)
        return res.status(400).send(GROUP_MSG.CANT_FOUND_CHANNEL_IN_GROUP);
      await meetingChannelRepository.remove(channel);
    } else {
      const channel = await chattingChannelRepository.findOne({
        where: { id: channelID },
        relations: ['group'],
      });
      if (!channel) return res.status(400).send(GROUP_MSG.INVALID_CHANNEL_ID);
      if (channel.group.id.toString() !== groupID)
        return res.status(400).send(GROUP_MSG.CANT_FOUND_CHANNEL_IN_GROUP);
      await chattingChannelRepository.remove(channel);
    }
    res.status(200).json();
  } catch (error) {
    next(error);
  }
};

export default {
  createGroup,
  getGroupMembers,
  createChannel,
  joinGroup,
  deleteGroup,
  deleteChannel,
};
