import {
  Connection,
  createConnection,
  getCustomRepository,
  getRepository,
  Repository,
} from 'typeorm';
import dotenv from 'dotenv';

import { User } from '../entity/user.entity';
import { Thread } from '../entity/thread.entity';
import { TextChannel } from '../entity/textchannel.entity';
import { Text } from '../entity/text.entity';
import { MeetingChannel } from '../entity/meetingchannel.entity';
import { Like } from '../entity/like.entity';
import { GroupMember } from '../entity/groupmember.entity';
import { Group } from '../entity/group.entity';
import { File } from '../entity/file.entity';
import { Session } from '../entity/session.entity';
import { UserRepository } from './repository/user.repository';

dotenv.config();

export let connection: Connection;
export let userRepository: UserRepository;
export let sessionRepository;

const connectDB = async () => {
  connection = await createConnection({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'duxcord',
    synchronize: true,
    logging: false,
    entities: [
      User,
      Session,
      Thread,
      TextChannel,
      Text,
      MeetingChannel,
      Like,
      GroupMember,
      Group,
      File,
    ],
  });

  return connection;
};

export const initORM = async () => {
  await connectDB();
  userRepository = await getCustomRepository(UserRepository);
  sessionRepository = await getRepository(Session);
};
