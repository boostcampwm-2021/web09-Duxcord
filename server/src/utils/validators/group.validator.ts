import { IsDefined, IsNotEmpty, IsUrl, validate } from 'class-validator';
import { VALIDATE_OPTIONS } from '.';
import { userRepository } from '../../loaders/orm.loader';
import { GROUP_MSG } from '../../messages';

class CreateGroupData {
  constructor({ groupName, thumbnail }) {
    this.groupName = groupName;
    this.thumbnail = thumbnail;
  }

  @IsNotEmpty({ message: GROUP_MSG.NEED_GROUP_NAME })
  groupName: string;

  thumbnail: string | null;
}

export const createGroupValidator = async (req, res, next) => {
  try {
    const createGroupData = new CreateGroupData(req.body);
    const errors = await validate(createGroupData, VALIDATE_OPTIONS);
    if (errors.length) return res.status(400).send(errors);
    const leaderID = req.session.userID;
    const leader = await userRepository.findOne({ where: { id: leaderID } });
    if (!leader) return res.status(400).send(GROUP_MSG.USER_NOT_FOUND);
    req.body.leader = leader;
    next();
  } catch (e) {
    next(e);
  }
};
