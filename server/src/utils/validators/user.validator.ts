import { compare } from 'bcryptjs';
import { IsDefined, IsNotEmpty, IsUrl, Matches, validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { userRepository } from '../../loaders/orm.loader';
import { signInMSG, signUpMSG, updateUserDataMSG } from '../../messages';

const loginIDRegex = /^[a-z][a-z0-9]{5,14}$/;
const usernameRegex = /^[^\s]{1,15}$/;
const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
const VALIDATE_OPTIONS = { validationError: { target: false, value: false } };

class SignUpData {
  constructor({ loginID, username, password }) {
    this.loginID = loginID;
    this.username = username;
    this.password = password;
  }

  @IsNotEmpty({ message: signUpMSG.nullInput })
  @Matches(loginIDRegex, { message: signUpMSG.invalidLoginID })
  loginID: string;

  @IsNotEmpty({ message: signUpMSG.nullInput })
  @Matches(usernameRegex, { message: signUpMSG.invalidPassword })
  username: string;

  @IsNotEmpty({ message: signUpMSG.nullInput })
  @Matches(passwordRegex, { message: signUpMSG.invalidPassword })
  password: string;
}

export const signUpValidator = async (req, res, next) => {
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
