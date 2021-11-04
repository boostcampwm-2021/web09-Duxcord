import { NextFunction, Request, Response } from 'express';

import { userRepository, textRepository, threadRepository } from '../db';

import { Thread } from '../entity/thread.entity';

export const createTextMSG = {
  userNotFound: '존재하지 않는 사용자 입니다.',
  emptyChat: '채팅을 입력해 주세요.',
  success: '스레드 전송 성공!',
};

const createThread = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content } = req.body;
    const { id } = req.params;
    const { userID } = req.session;
    const user = await userRepository.findOne({ where: { id: userID } });
    const text = await textRepository.findOne({ where: { id: id } });

    if (!user) return res.status(400).send(createTextMSG.userNotFound);
    if (!content || !content.trim()) return res.status(400).send(createTextMSG.emptyChat);

    const newThread = new Thread();
    newThread.content = content;
    newThread.user = user;
    newThread.text = text;

    await threadRepository.save(newThread);

    return res.status(200).send(createTextMSG.success);
  } catch (error) {
    next(error);
  }
};

export default { createThread };
