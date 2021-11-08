import { NextFunction, Request, Response } from 'express';

import { userRepository, chatRepository, threadRepository } from '../db';

import { Thread } from '../entity/thread.entity';

export const createChatMSG = {
  userNotFound: '존재하지 않는 사용자 입니다.',
  chatNotFound: '존재하지 않는 텍스트 입니다.',
  emptyChat: '채팅을 입력해 주세요.',
  success: '스레드 전송 성공!',
};

const createThread = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content } = req.body;
    const { id } = req.params;
    const { userID } = req.session;
    const user = await userRepository.findOne({ where: { id: userID } });
    const chat = await chatRepository.findOne({ where: { id: id } });

    if (!user) return res.status(400).send(createChatMSG.userNotFound);
    if (!chat) return res.status(400).send(createChatMSG.chatNotFound);
    if (!content || !content.trim()) return res.status(400).send(createChatMSG.emptyChat);

    const newThread = new Thread();
    newThread.content = content;
    newThread.user = user;
    newThread.chat = chat;

    await threadRepository.save(newThread);

    return res.status(200).send(createChatMSG.success);
  } catch (error) {
    next(error);
  }
};

export default { createThread };
