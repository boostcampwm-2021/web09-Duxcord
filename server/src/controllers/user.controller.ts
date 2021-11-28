import { hash } from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { groupMemberRepository, userRepository } from '../loaders/orm.loader';
import { User } from '../db/entities';
import { signUpMSG, signInMSG, signOutMSG, getUserGroupsMSG } from '../messages';
import { getPresignUrl } from '../utils/S3';

const saltRounds = 10;

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const { loginID, username, password } = req.body;

  try {
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
  const { userID } = req.body;

  req.session.userID = userID;
  return res.status(200).send(signInMSG.success);
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
  const { userID } = req.session;
  const { username, thumbnail, bio } = req.body;
  try {
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
