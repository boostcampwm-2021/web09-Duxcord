import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';

import { connectDB } from './db';

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
};

appInit();
