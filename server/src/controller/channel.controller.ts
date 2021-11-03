import { NextFunction, Request, Response } from 'express';

import { textChannelRepository, userRepository, textRepository } from '../db';

import { Text } from '../entity/text.entity';

const createText = async (req: Request, res: Response, next: NextFunction) => {
  const { content, textChannelId } = req.body;
  try {
    const { userID } = req.session;
    const user = await userRepository.findOne({ where: { id: userID } });
    const textChannel = await textChannelRepository.findOne({ where: { id: textChannelId } });

    if (!user) return res.status(400).send('존재하지 않는 사용자 입니다.');
    if (!content.trim()) return res.status(400).send('채팅을 입력해주세요.');

    const newText = new Text();
    newText.content = content;
    newText.user = user;
    newText.textChannel = textChannel;

    await textRepository.save(newText);

    return res.status(200).json(newText);
  } catch (error) {
    next(error);
  }
};

export default { createText };
