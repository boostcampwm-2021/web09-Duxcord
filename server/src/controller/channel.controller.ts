import { NextFunction, Request, Response } from 'express';

import { textChannelRepository, userRepository, textRepository } from '../db';

import { Text } from '../entity/text.entity';
import { io } from '../socket';

export const createTextMSG = {
  userNotFound: '존재하지 않는 사용자 입니다.',
  emptyChat: '채팅을 입력해 주세요.',
  success: '메시지 전송 성공!',
};

const getText = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { textChannelId } = req.params;
    const page = Number(req.query.page);
    const texts = await textRepository.findTextsByPages(textChannelId, page);

    return res.status(200).json(texts);
  } catch (error) {
    next(error);
  }
};

const createText = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content } = req.body;
    const { textChannelId } = req.params;
    const { userID } = req.session;
    const user = await userRepository.findOne({ where: { id: userID } });
    const textChannel = await textChannelRepository.findOne({ where: { id: textChannelId } });

    if (!user) return res.status(400).send(createTextMSG.userNotFound);
    if (!content.trim()) return res.status(400).send(createTextMSG.emptyChat);

    const newText = new Text();
    newText.content = content;
    newText.user = user;
    newText.textChannel = textChannel;

    await textRepository.save(newText);

    io.to(`${textChannelId}`).emit('chat', {
      id: newText.id,
      createdAt: newText.createdAt,
      updatedAt: newText.updatedAt,
      content: newText.content,
      user: {
        id: user.id,
        thumbnail: user.thumbnail,
        username: user.username,
      },
    });

    return res.status(200).send(createTextMSG.success);
  } catch (error) {
    next(error);
  }
};

export default { getText, createText };
