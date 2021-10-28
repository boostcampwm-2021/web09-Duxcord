import dotenv from 'dotenv';
dotenv.config();

export default {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'duxcord',
  synchronize: true,
  logging: false,
};
