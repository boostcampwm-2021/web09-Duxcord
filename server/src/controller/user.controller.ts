import { hash } from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { userRepository } from '../db';
import { User } from '../entity/user.entity';

const saltRounds = 10;
const nullCheck = (data) => data !== undefined && data !== null && data !== '';

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const { userID, username, password } = req.body;

  try {
    if (![userID, username, password].every((data) => nullCheck(data)))
      return res.status(400).send('회원가입에 필요한 데이터일부가 누락되었습니다 않습니다.');

    const isUsedID = await userRepository.findOne({ where: { userID: userID } });
    if (isUsedID) return res.status(400).send('이미 사용중인 ID 입니다.');

    const newUser = new User();
    newUser.userID = userID;
    newUser.userName = username;
    newUser.password = await hash(password, saltRounds);
    userRepository.save(newUser);

    return res.status(200).send('회원가입에 성공했습니다.');
  } catch (error) {
    next(error);
  }
};

export default {
  signUp,
};
