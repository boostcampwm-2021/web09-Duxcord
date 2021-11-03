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
import { Reaction } from '../entity/reaction.entity';
import { GroupMember } from '../entity/groupmember.entity';
import { Workgroup } from '../entity/workgroup.entity';
import { File } from '../entity/file.entity';
import { Session } from '../entity/session.entity';
import { UserRepository } from './repository/user.repository';
import { GroupMemberRepository } from './repository/groupmember.repository';

dotenv.config();

export let connection: Connection;
export let userRepository: UserRepository;
export let sessionRepository;
export let groupRepository: Repository<Workgroup>;
export let groupMemberRepository: GroupMemberRepository;
export let textChannelRepository: Repository<TextChannel>;
export let meetingChannelRepository: Repository<MeetingChannel>;
export let textRepository: Repository<Text>;

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
      Reaction,
      GroupMember,
      Workgroup,
      File,
    ],
  });

  return connection;
};

export const initORM = async () => {
  await connectDB();
  userRepository = await getCustomRepository(UserRepository);
  sessionRepository = await getRepository(Session);
  groupRepository = await getRepository(Workgroup);
  groupMemberRepository = await getCustomRepository(GroupMemberRepository);
  textChannelRepository = await getRepository(TextChannel);
  meetingChannelRepository = await getRepository(MeetingChannel);
  textRepository = await getRepository(Text);
};
