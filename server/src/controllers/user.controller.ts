import { compare, hash } from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { groupMemberRepository, userRepository } from '../loaders/orm.loader';
import { User } from '../db/entities';
import { signUpMSG, signInMSG, signOutMSG, getUserGroupsMSG } from '../messages';

declare module 'express-session' {
  interface SessionData {
    userID: number;
  }
}

const saltRounds = 10;
const nullCheck = (data) => {
  const trimedData = data.trim();
  return trimedData !== undefined && trimedData !== null && trimedData !== '';
};
const loginIDRegex = /^[a-z][a-z0-9]{5,14}$/;
const loginIDValidation = (loginID) => loginIDRegex.test(loginID);
const usernameRegex = /^[^\s]{1,15}$/;
const usernameValidation = (username) => usernameRegex.test(username);
const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
const passwordValidation = (password) => passwordRegex.test(password);

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const { loginID, username, password } = req.body;

  try {
    if (![loginID, username, password].every((data) => nullCheck(data)))
      return res.status(400).send(signUpMSG.nullInput);

    const isValidLoginID = loginIDValidation(loginID);
    if (!isValidLoginID) return res.status(400).send(signUpMSG.inValidLoginID);

    const isValidUsername = usernameValidation(username);
    if (!isValidUsername) return res.status(400).send(signUpMSG.inValidUsername);

    const isValidPassword = passwordValidation(password);
    if (!isValidPassword) return res.status(400).send(signUpMSG.inValidPassword);

    const isUsedID = await userRepository.findOne({ where: { loginID: loginID } });
    if (isUsedID) return res.status(400).send(signUpMSG.usedID);

    const newUser = new User();
    newUser.loginID = loginID;
    newUser.username = username;
    newUser.password = await hash(password, saltRounds);
    await userRepository.save(newUser);

    return res.status(200).send(signUpMSG.success);
  } catch (error) {
    next(error);
  }
};

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  const { loginID, password } = req.body;

  try {
    const user = await userRepository.findOne({ where: { loginID: loginID } });
    if (!user) return res.status(400).send(signInMSG.userNotFound);

    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) return res.status(400).send(signInMSG.wrongPassword);

    req.session.userID = user.id;
    return res.status(200).send(signInMSG.success);
  } catch (error) {
    next(error);
  }
};

const signOut = (req: Request, res: Response, next: NextFunction) => {
  return req.session.destroy((error) => {
    if (error) return next(error);
    return res.status(200).send(signOutMSG.success);
  });
};

const getUserData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userID } = req.session;
    const userdata = await userRepository.findByID(userID);

    return res.status(200).json({ ...userdata, id: userID });
  } catch (error) {
    next(error);
  }
};

const getUserGroups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userID } = req.session;
    const userdata = await userRepository.findByID(userID);
    if (!userdata) return res.status(400).send(getUserGroupsMSG.userNotFound);

    const groups = await groupMemberRepository.findGroupsByUserID(userID);

    return res.status(200).json(groups);
  } catch (error) {
    next(error);
  }
};

const getOtherUserData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userdata = await userRepository.findByID(Number(id));

    return res.status(200).json(userdata);
  } catch (error) {
    next(error);
  }
};

const updateUserData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userID } = req.session;
    const { username, thumbnail, bio } = req.body;

    const isValidUsername = usernameValidation(username);
    if (!isValidUsername) return res.status(400).send(signUpMSG.inValidUsername);

    if (username === undefined) return res.status(400).send(updateUserDataMSG.needUsername);
    if (thumbnail === undefined) return res.status(400).send(updateUserDataMSG.needThumbnail);
    if (bio === undefined) return res.status(400).send(updateUserDataMSG.needBio);

    const userdata = await userRepository.save({
      id: userID,
      username,
      thumbnail,
      bio,
    });

    return res.status(200).json(userdata);
  } catch (error) {
    next(error);
  }
};

export default {
  signUp,
  signIn,
  signOut,
  getUserData,
  getUserGroups,
  getOtherUserData,
  updateUserData,
};
