import { compare } from 'bcryptjs';
import { IsDefined, IsNotEmpty, Matches, validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { userRepository } from '../../loaders/orm.loader';
import { SIGN_IN_MSG, SIGN_UP_MSG, UPDATE_USER_DATA_MSG } from '../../messages';
import { CatchError, CustomError } from '../CatchError';
import { REGEXP, VALIDATE_OPTIONS } from './utils';

class SignUpData {
  constructor({ loginID, username, password }) {
    this.loginID = loginID;
    this.username = username;
    this.password = password;
  }

  @IsNotEmpty({ message: SIGN_UP_MSG.NULL_INPUT })
  @Matches(REGEXP.LOGIN_ID, { message: SIGN_UP_MSG.INVALID_LOGIN_ID })
  loginID: string;

  @IsNotEmpty({ message: SIGN_UP_MSG.NULL_INPUT })
  @Matches(REGEXP.USERNAME, { message: SIGN_UP_MSG.INVALID_USERNAME })
  username: string;

  @IsNotEmpty({ message: SIGN_UP_MSG.NULL_INPUT })
  @Matches(REGEXP.PASSWORD, { message: SIGN_UP_MSG.INVALID_PASSWORD })
  password: string;
}

class UpdateUserData {
  constructor({ username, thumbnail, bio }) {
    this.username = username;
    this.thumbnail = thumbnail;
    this.bio = bio;
  }

  @IsNotEmpty({ message: UPDATE_USER_DATA_MSG.NEED_USER_NAME })
  @Matches(REGEXP.USERNAME, { message: SIGN_UP_MSG.INVALID_USERNAME })
  username: string;

  @IsDefined({ message: UPDATE_USER_DATA_MSG.NEED_THUMB_NAIL })
  thumbnail: string | null;

  @IsDefined()
  bio: string | null;
}

class UserValidator {
  @CatchError
  async signUpValidator(req: Request, res: Response, next: NextFunction) {
    const { loginID, username, password } = req.body;

    const signUpData = new SignUpData({ loginID, username, password });
    const errors = await validate(signUpData, VALIDATE_OPTIONS);

    if (errors.length) throw new CustomError({ message: errors, status: 400 });

    const isUsedID = await userRepository.findOne({ where: { loginID: loginID } });
    if (isUsedID) throw new CustomError({ message: SIGN_UP_MSG.USED_ID, status: 400 });

    next();
  }

  @CatchError
  async signInValidator(req, res, next) {
    const { loginID, password } = req.body;

    const user = await userRepository.findOne({ where: { loginID: loginID } });
    if (!user) throw new CustomError({ message: SIGN_IN_MSG.USER_NOT_FOUND, status: 400 });

    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword)
      throw new CustomError({ message: SIGN_IN_MSG.WRONG_PASSWORD, status: 400 });

    req.body.userID = user.id;

    next();
  }

  @CatchError
  async updateUserValidator(req: Request, res: Response, next: NextFunction) {
    const { userID } = req.session;
    const userdata = req.body;

    const newUserData = new UpdateUserData(userdata);
    const errors = await validate(newUserData, VALIDATE_OPTIONS);
    if (errors.length) throw new CustomError({ message: errors, status: 400 });
    const user = await userRepository.findOne(userID);
    if (!user) throw new CustomError({ message: UPDATE_USER_DATA_MSG.USER_NOT_FOUND, status: 400 });

    next();
  }
}

export const userValidator = new UserValidator();
