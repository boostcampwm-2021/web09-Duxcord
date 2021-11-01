import { Connection, createConnection, getRepository, Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import dotenv from 'dotenv';
import { Session } from '../entity/session.entity';
dotenv.config();

export let connection: Connection;
export let userRepository: Repository<User>;
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
    entities: [User, Session],
  });

  return connection;
};

export const initORM = async () => {
  await connectDB();
  userRepository = await getRepository(User);
  sessionRepository = await getRepository(Session);
};
