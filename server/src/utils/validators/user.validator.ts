import { compare } from 'bcryptjs';
import { IsDefined, IsNotEmpty, Matches, validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { userRepository } from '../../loaders/orm.loader';
import { signInMSG, signUpMSG, updateUserDataMSG } from '../../messages';
import { REGEXP, VALIDATE_OPTIONS } from './utils';

class SignUpData {
  constructor({ loginID, username, password }) {
    this.loginID = loginID;
    this.username = username;
    this.password = password;
  }

  @IsNotEmpty({ message: signUpMSG.nullInput })
  @Matches(REGEXP.LOGIN_ID, { message: signUpMSG.invalidLoginID })
  loginID: string;

  @IsNotEmpty({ message: signUpMSG.nullInput })
  @Matches(REGEXP.USERNAME, { message: signUpMSG.invalidPassword })
  username: string;

  @IsNotEmpty({ message: signUpMSG.nullInput })
  @Matches(REGEXP.PASSWORD, { message: signUpMSG.invalidPassword })
  password: string;
}

export const signUpValidator = async (req: Request, res: Response, next: NextFunction) => {
  const { loginID, username, password } = req.body;

  try {
    const signUpData = new SignUpData({ loginID, username, password });
    const errors = await validate(signUpData, VALIDATE_OPTIONS);

    if (errors.length) return res.status(400).json(errors);

    const isUsedID = await userRepository.findOne({ where: { loginID: loginID } });
    if (isUsedID) return res.status(400).send(signUpMSG.usedID);

    next();
  } catch (e) {
    next(e);
  }
};

export const signInValidator = async (req, res, next) => {
  const { loginID, password } = req.body;

  const user = await userRepository.findOne({ where: { loginID: loginID } });
  if (!user) return res.status(400).send(signInMSG.userNotFound);

  const isValidPassword = await compare(password, user.password);
  if (!isValidPassword) return res.status(400).send(signInMSG.wrongPassword);

  req.body.userID = user.id;

  next();
};

class UpdateUserData {
  constructor({ username, thumbnail, bio }) {
    this.username = username;
    this.thumbnail = thumbnail;
    this.bio = bio;
  }

  @IsNotEmpty({ message: updateUserDataMSG.needUsername })
  @Matches(REGEXP.USERNAME, { message: signUpMSG.invalidUsername })
  username: string;

  @IsDefined({ message: updateUserDataMSG.needThumbnail })
  thumbnail: string | null;

  @IsDefined()
  bio: string | null;
}

export const updateUserValidator = async (req: Request, res: Response, next: NextFunction) => {
  const { userID } = req.session;
  const userdata = req.body;

  try {
    const newUserData = new UpdateUserData(userdata);
    const errors = await validate(newUserData, VALIDATE_OPTIONS);
    if (errors.length) return res.status(400).json(errors);
    const user = await userRepository.findOne(userID);
    if (!user) return res.status(400).send(updateUserDataMSG.userNotFound);

    next();
  } catch (e) {
    next(e);
  }
};
