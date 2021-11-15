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

const nullCheck = (data) => data !== undefined && data !== null && data !== '';
const encodeBase64 = (str: string): string => Buffer.from(str, 'binary').toString('base64');

const MSG = {
  needGroupName: '그룹명이 누락되었습니다.',
  userNotFound: '존재하지 않는 회원입니다.',
  groupNotFound: '존재하지 않는 그룹입니다.',
  wrongChannelType: '올바르지 않은 채널 타입입니다.',
  alreadyJoined: '이미 그룹에 가입된 사용자입니다.',
};
const DEFFAULT_CHANNEL_NAME = 'general';

const createGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { groupName, groupThumbnail } = req.body;
  try {
    if (!nullCheck(groupName)) return res.status(400).send(MSG.needGroupName);
    const leaderID = req.session.userID;
    const leader = await userRepository.findOne({ where: { id: leaderID } });
    if (!leader) return res.status(400).send(MSG.userNotFound);

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
    newMeetingChannel.name = DEFFAULT_CHANNEL_NAME;
    await meetingChannelRepository.save(newMeetingChannel);
    const responseMeetingChannel = (({ group, ...o }) => o)(newMeetingChannel);

    const newChattingChannel = new ChattingChannel();
    newChattingChannel.group = newGroup;
    newChattingChannel.name = DEFFAULT_CHANNEL_NAME;
    await chattingChannelRepository.save(newChattingChannel);
    const responseChattingChannel = (({ group, ...o }) => o)(newChattingChannel);

    const responseGroup = {
      id: newGroup.id,
      name: groupName,
      code: newCode,
      groupThumbnail: groupThumbnail,
      meetingChannels: [responseMeetingChannel],
      chattingChannels: [responseChattingChannel],
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
    if (!group) return res.status(400).send(MSG.groupNotFound);

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
    const group = await groupRepository.findOne({ where: { id: id } });
    if (!group) return res.status(400).send(MSG.groupNotFound);
    if (!Object.values(ChannelType).includes(channelType))
      return res.status(400).send(MSG.wrongChannelType);

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
    if (!group) return res.status(400).send(MSG.groupNotFound);

    const relation = await groupMemberRepository
      .createQueryBuilder('group_member')
      .where('group_member.groupId = :groupID && group_member.userId = :userID', {
        groupID: group.id,
        userID: userID,
      })
      .getOne();

    if (relation) return res.status(400).send(MSG.alreadyJoined);

    const now = new Date();
    await groupMemberRepository.insert({ group: group, user: user, lastAccessTime: now });

    res.status(200).json(group);
  } catch (error) {
    next(error);
  }
};

export default { createGroup, getGroupMembers, createChannel, joinGroup };
