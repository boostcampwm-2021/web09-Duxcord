import { Connection, createConnection } from 'typeorm';
import dotenv from 'dotenv';

import { User } from '../entity/User';
import { Thread } from '../entity/Thread';
import { TextChannel } from '../entity/TextChannel';
import { Text } from '../entity/Text';
import { MeetingChannel } from '../entity/MeetingChannel';
import { Like } from '../entity/Like';
import { GroupMember } from '../entity/GroupMember';
import { Group } from '../entity/Group';
import { File } from '../entity/File';

dotenv.config();

let connection: Connection;

export const connectDB = async () => {
  try {
    connection = await createConnection({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'duxcord',
      synchronize: true,
      logging: false,
      entities: [User, Thread, TextChannel, Text, MeetingChannel, Like, GroupMember, Group, File],
    });
    return connection;
  } catch (error) {
    console.log(error);
  }
};
