import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';
import { getRepository } from 'typeorm';

import { connectDB } from './db';
import { User } from './entity/User';

const appInit = async () => {
  await connectDB();
  const app = express();
  app.set('port', process.env.PORT || 8000);
  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.listen(app.get('port'), () => {
    console.log('Express server has started on port', app.get('port'));
  });

  const user = await getRepository(User).create({
    userID: 'test',
    userName: 'test',
    password: 'test',
  });
  await getRepository(User).save(user);
  console.log(await getRepository(User).find({ where: { userName: 'test' } }));
};

appInit();
