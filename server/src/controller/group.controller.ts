import { NextFunction, Request, Response } from 'express';

import {
  groupMemberRepository,
  groupRepository,
  meetingChannelRepository,
  textChannelRepository,
  userRepository,
} from '../db';
import { Workgroup } from '../entity/workgroup.entity';

const nullCheck = (data) => data !== undefined && data !== null && data !== '';
const encodeBase64 = (str: string): string => Buffer.from(str, 'binary').toString('base64');

const createGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { groupName, groupThumbnail } = req.body;
  try {
    if (!nullCheck(groupName)) return res.status(400).send('그룹명이 누락되었습니다.');
    const leaderId = req.session.userID;
    const leader = await userRepository.findOne({ where: { id: leaderId } });
    if (!leader) return res.status(400).send('존재하지 않는 회원입니다.');

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

    await meetingChannelRepository.insert({ group: newGroup, name: 'default' });

    await textChannelRepository.insert({ group: newGroup, name: 'default' });

    return res.status(200).json({ code: newGroup.code });
  } catch (error) {
    next(error);
  }
};

const getGroupMembers = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const group = await groupRepository.findOne({ where: { id: id } });
    if (!group) return res.status(400).send('존재하지 않는 그룹 아이디입니다.');

    const members = await groupMemberRepository.findUsersByGroupID(group.id);

    res.status(200).json({ members });
  } catch (error) {
    next(error);
  }
};

const joinGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { groupCode } = req.body;

  try {
    const { userID } = req.session;
    const user = await userRepository.findOne({ where: { id: userID } });
    const group = await groupRepository.findOne({ where: { code: groupCode } });

    const relation = await groupMemberRepository
      .createQueryBuilder('group_member')
      .where('group_member.groupId = :groupID && group_member.userId = :userID', {
        groupID: group.id,
        userID: userID,
      })
      .getOne();

    if (relation) return res.status(400).send('이미 그룹에 가입된 사용자입니다');

    const now = new Date();
    await groupMemberRepository.insert({ group: group, user: user, lastAccessTime: now });

    res.status(200).json({ group });
  } catch (error) {
    next(error);
  }
};

export default { createGroup, getGroupMembers, joinGroup };
