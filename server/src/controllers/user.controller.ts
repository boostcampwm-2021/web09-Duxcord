import { compare, hash } from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { groupMemberRepository, userRepository } from '../loaders/orm.loader';
import { User } from '../db/entities';
import { getPresignUrl } from '../utils/S3';

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
const passwordRegex = /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
const passwordValidation = (password) => passwordRegex.test(password);
export const signUpMSG = {
  nullInput: '회원가입에 필요한 데이터를 모두 입력해주세요.',
  inValidLoginID: 'ID는 영소문자로 시작하는 6~15자의 영소문자 또는 숫자 여야 합니다.',
  inValidUsername: '유저 이름은 공백없이 1~15자여야 합니다.',
  inValidPassword: '비밀번호는 8자 이상 영소문자, 숫자, 특수문자를 최소 1개씩 포함하여야합니다.',
  usedID: '이미 사용중인 ID 입니다.',
  success: '회원가입에 성공했습니다.',
};
export const signInMSG = {
  userNotFound: '존재하지 않는 회원입니다.',
  wrongPassword: '비밀번호가 올바르지 않습니다.',
  success: '로그인 성공!',
};
const signOutMSG = {
  success: '로그아웃 성공!',
};
const getUserGroupsMSG = {
  userNotFound: '존재하지 않는 유저입니다.',
};
const updateUserDataMSG = {
  needUsername: '사용자 이름이 필요합니다.',
  needThumbnail: '사용자 이미지가 필요합니다.',
  needBio: '사용자 소개가 필요합니다.',
};

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

const getPresignedUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uploadName = req.body.uploadName;
    const url = await getPresignUrl(uploadName);
    return res.status(200).json({ url });
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
  getPresignedUrl,
};
