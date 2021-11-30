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
import { Repository } from 'typeorm';

const nullCheck = (data) => data !== undefined && data !== null && data !== '';
const encodeBase64 = (str: string): string => Buffer.from(str, 'binary').toString('base64');

export const MSG = {
  needGroupName: '그룹명이 누락되었습니다.',
  userNotFound: '존재하지 않는 회원입니다.',
  groupNotFound: '존재하지 않는 그룹입니다.',
  wrongChannelType: '올바르지 않은 채널 타입입니다.',
  alreadyJoined: '이미 그룹에 가입된 사용자입니다.',
  channelNameEmpty: '채널 이름을 입력해주세요',
  groupIDNotFound: '존재하지 않는 그룹 아이디입니다.',
  noGroupDeleteAuthorization: '그룹 삭제 권한이 없습니다.',
  deleteGroup: '그룹이 삭제되었습니다.',
  channelIDNotFound: '존재하지 않는 채널 아이디입니다.',
  noChannelDeleteAuthorization: '채널 삭제 권한이 없습니다.',
  noChannelInGroup: '해당 그룹에는 해당 채널이 존재하지 않습니다.',
  deleteChannel: '채널이 삭제되었습니다.',
};
const DEFAULT_CHANNEL_NAME = 'general';

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
    if (!channelName || !channelName.trim()) return res.status(400).send(MSG.channelNameEmpty);
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

    const relation = await groupMemberRepository.checkUserInGroup(group.id, userID);

    if (relation) return res.status(400).send(MSG.alreadyJoined);

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
    if (!group) return res.status(400).send(MSG.groupIDNotFound);
    if (group.leader.id !== userID) return res.status(400).send(MSG.noGroupDeleteAuthorization);

    await groupRepository.remove(group);
    res.status(200).json(MSG.deleteGroup);
  } catch (error) {
    next(error);
  }
};

const deleteChannel = async (req: Request, res: Response, next: NextFunction) => {
  const { groupID, channelID, channelType } = req.params;
  const { userID } = req.session;

  try {
    const group = await groupRepository.findByIDWithLeaderID(groupID);

    if (!group) return res.status(400).send(MSG.groupIDNotFound);
    if (group.leader.id !== userID) return res.status(400).send(MSG.noChannelDeleteAuthorization);
    if (!['meeting', 'chatting'].includes(channelType))
      return res.status(400).send(MSG.wrongChannelType);

    if (channelType === 'meeting') {
      const channel = await meetingChannelRepository.findOne({
        where: { id: channelID },
        relations: ['group'],
      });
      if (!channel) return res.status(400).send(MSG.channelIDNotFound);
      if (channel.group.id.toString() !== groupID)
        return res.status(400).send(MSG.noChannelInGroup);
      await meetingChannelRepository.remove(channel);
    } else {
      const channel = await chattingChannelRepository.findOne({
        where: { id: channelID },
        relations: ['group'],
      });
      if (!channel) return res.status(400).send(MSG.channelIDNotFound);
      if (channel.group.id.toString() !== groupID) {
        return res.status(400).send(MSG.noChannelInGroup);
      }
      await chattingChannelRepository.remove(channel);
    }
    res.status(200).json(MSG.deleteChannel);
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
