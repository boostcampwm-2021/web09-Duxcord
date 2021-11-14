import {
  Connection,
  createConnection,
  getCustomRepository,
  getRepository,
  Repository,
} from 'typeorm';
import dotenv from 'dotenv';

import { User } from '../db/entities/user.entity';
import { Thread } from '../db/entities/thread.entity';
import { ChattingChannel } from '../db/entities/chattingchannel.entity';
import { Chat } from '../db/entities/chat.entity';
import { MeetingChannel } from '../db/entities/meetingchannel.entity';
import { Reaction } from '../db/entities/reaction.entity';
import { GroupMember } from '../db/entities/groupmember.entity';
import { Workgroup } from '../db/entities/workgroup.entity';
import { File } from '../db/entities/file.entity';
import { Session } from '../db/entities/session.entity';
import { UserRepository } from '../db/repositories/user.repository';
import { GroupMemberRepository } from '../db/repositories/groupmember.repository';
import { ChatRepository } from '../db/repositories/chat.repository';
import { ThreadRepository } from '../db/repositories/thread.repository';
dotenv.config();

export let connection: Connection;
export let userRepository: UserRepository;
export let sessionRepository;
export let groupRepository: Repository<Workgroup>;
export let groupMemberRepository: GroupMemberRepository;
export let chattingChannelRepository: Repository<ChattingChannel>;
export let meetingChannelRepository: Repository<MeetingChannel>;
export let chatRepository: ChatRepository;
export let threadRepository: ThreadRepository;
export let reactionRepository: Repository<Reaction>;

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
      ChattingChannel,
      Chat,
      MeetingChannel,
      Reaction,
      GroupMember,
      Workgroup,
      File,
    ],
  });

  return connection;
};

export const ormLoader = async () => {
  await connectDB();
  userRepository = await getCustomRepository(UserRepository);
  sessionRepository = await getRepository(Session);
  groupRepository = await getRepository(Workgroup);
  groupMemberRepository = await getCustomRepository(GroupMemberRepository);
  chattingChannelRepository = await getRepository(ChattingChannel);
  meetingChannelRepository = await getRepository(MeetingChannel);
  chatRepository = await getCustomRepository(ChatRepository);
  threadRepository = await getCustomRepository(ThreadRepository);
  reactionRepository = await getRepository(Reaction);
};
