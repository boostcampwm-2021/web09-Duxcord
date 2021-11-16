import {
  Connection,
  createConnection,
  getCustomRepository,
  getRepository,
  Repository,
} from 'typeorm';
import {
  Workgroup,
  Session,
  ChattingChannel,
  MeetingChannel,
  Reaction,
  User,
  Thread,
  Chat,
  GroupMember,
  File,
} from '../db/entities';
import {
  UserRepository,
  GroupMemberRepository,
  ChatRepository,
  ThreadRepository,
  WorkgroupRepository,
} from '../db/repositories';
import dotenv from 'dotenv';
dotenv.config();

export let connection: Connection;
export let userRepository: UserRepository;
export let sessionRepository;
export let groupRepository: WorkgroupRepository;
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
  groupRepository = await getCustomRepository(WorkgroupRepository);
  groupMemberRepository = await getCustomRepository(GroupMemberRepository);
  chattingChannelRepository = await getRepository(ChattingChannel);
  meetingChannelRepository = await getRepository(MeetingChannel);
  chatRepository = await getCustomRepository(ChatRepository);
  threadRepository = await getCustomRepository(ThreadRepository);
  reactionRepository = await getRepository(Reaction);
};
