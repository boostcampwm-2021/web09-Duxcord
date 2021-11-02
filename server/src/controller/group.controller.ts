import { NextFunction, Request, Response } from 'express';
import { groupRepository, userRepository } from '../db';

import { Group } from '../entity/group.entity';

const nullCheck = (data) => data !== undefined && data !== null && data !== '';

const createGroup = async (req: Request, res: Response, next: NextFunction) => {
  const { groupName, groupThumbnail } = req.body;
  try {
    if (!nullCheck(groupName)) return res.status(400).send('그룹명이 누락되었습니다.');
    const leaderId = req.session.userID;
    const leader = await userRepository.findOne({ where: { id: leaderId } });
    if (!leader) return res.status(400).send('존재하지 않는 회원입니다.');

    const newGroup = new Group();
    newGroup.name = groupName;
    newGroup.leader = leader;
    newGroup.thumbnail = groupThumbnail;
    newGroup.code = '123456';
    await groupRepository.save(newGroup);

    return res.status(200).json({ code: newGroup.code });
  } catch (error) {
    next(error);
  }
};

export default { createGroup };
