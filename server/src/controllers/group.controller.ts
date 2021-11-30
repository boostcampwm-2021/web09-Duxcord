import { NextFunction, Request, Response } from 'express';

import {
  groupMemberRepository,
  groupRepository,
  meetingChannelRepository,
  chattingChannelRepository,
} from '../loaders/orm.loader';
import { ChattingChannel, MeetingChannel, Workgroup } from '../db/entities';
import { ChannelType } from '../types/ChannelType';
import { GROUP_MSG } from '../messages';

const encodeBase64 = (str: string): string => Buffer.from(str, 'binary').toString('base64');

const DEFAULT_CHANNEL_NAME = 'general';

const createGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { groupName, groupThumbnail, leader } = req.body;
  try {
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
  const { group } = req.body;
  try {
    const members = await groupMemberRepository.findUsersByGroupID(group.id);

    res.status(200).json(members);
  } catch (error) {
    next(error);
  }
};

const createChannel = async (req: Request, res: Response, next: NextFunction) => {
  const { channelType, channelName, group } = req.body;

  try {
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
  const { group, user } = req.body;

  try {
    const now = new Date();
    await groupMemberRepository.insert({ group: group, user: user, lastAccessTime: now });
    res.status(200).json(group);
  } catch (error) {
    next(error);
  }
};

const deleteGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { group } = req.body;

  try {
    await groupRepository.remove(group);
    res.status(200).json(GROUP_MSG.GROUP_DELETION_SUCCESS);
  } catch (error) {
    next(error);
  }
};

const deleteChannel = async (req: Request, res: Response, next: NextFunction) => {
  const { channelType } = req.params;
  const { channel } = req.body;

  try {
    if (channelType === ChannelType.chatting) await chattingChannelRepository.remove(channel);
    else await meetingChannelRepository.remove(channel);
    res.status(200).json(GROUP_MSG.CHANNEL_DELETION_SUCCESS);
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
