import { Connection, createConnection } from 'typeorm';
import { User } from '../entity/User';
import dotenv from 'dotenv';
dotenv.config();

let connection: Connection;

export const connectDB = async () => {
  connection = await createConnection({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'duxcord',
    synchronize: true,
    logging: false,
    entities: [User],
  });

  return connection;
};
