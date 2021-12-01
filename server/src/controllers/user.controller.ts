import { hash } from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { groupMemberRepository, userRepository } from '../loaders/orm.loader';
import { User } from '../db/entities';
import { SIGN_UP_MSG, SIGN_IN_MSG, SIGN_OUT_MSG, GET_USER_GROUP_MSG } from '../messages';
import { getPresignUrl } from '../utils';
import { CatchError } from '../utils/CatchError';

const saltRounds = 10;

class UserController {
  @CatchError
  async signUp(req: Request, res: Response, next: NextFunction) {
    const { loginID, username, password } = req.body;

    const newUser = new User();
    newUser.loginID = loginID;
    newUser.username = username;
    newUser.password = await hash(password, saltRounds);
    await userRepository.save(newUser);

    return res.status(200).send(SIGN_UP_MSG.SUCCESS);
  }

  @CatchError
  async signIn(req: Request, res: Response, next: NextFunction) {
    const { userID } = req.body;

    req.session.userID = userID;
    return res.status(200).send(SIGN_IN_MSG.SUCCESS);
  }

  signOut(req: Request, res: Response, next: NextFunction) {
    return req.session.destroy((error) => {
      if (error) return next(error);
      return res.status(200).send(SIGN_OUT_MSG.SUCCESS);
    });
  }

  @CatchError
  async getUserData(req: Request, res: Response, next: NextFunction) {
    const { userID } = req.session;
    const userdata = await userRepository.findByID(userID);

    return res.status(200).json({ ...userdata, id: userID });
  }

  @CatchError
  async getUserGroups(req: Request, res: Response, next: NextFunction) {
    const { userID } = req.session;
    const userdata = await userRepository.findByID(userID);
    if (!userdata) return res.status(400).send(GET_USER_GROUP_MSG.USER_NOT_FOUND);

    const groups = await groupMemberRepository.findGroupsByUserID(userID);

    return res.status(200).json(groups);
  }

  @CatchError
  async getOtherUserData(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const userdata = await userRepository.findByID(Number(id));

    return res.status(200).json(userdata);
  }

  @CatchError
  async updateUserData(req: Request, res: Response, next: NextFunction) {
    const { userID } = req.session;
    const { username, thumbnail, bio } = req.body;

    const userdata = await userRepository.save({
      id: userID,
      username,
      thumbnail,
      bio,
    });

    return res.status(200).json(userdata);
  }

  @CatchError
  async getPresignedUrl(req: Request, res: Response, next: NextFunction) {
    const uploadName = req.body.uploadName;
    const url = await getPresignUrl(uploadName);
    return res.status(200).json({ url });
  }
}

export default new UserController();
