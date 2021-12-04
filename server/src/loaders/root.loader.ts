import session from 'express-session';
import { TypeormStore } from 'typeorm-store';
import { expressLoader } from './express.loader';
import { ormLoader, sessionRepository } from './orm.loader';
import { socketLoader } from './socket.loader';
import dotenv from 'dotenv';
dotenv.config();

export const rootLoader = async (app, httpServer) => {
  await ormLoader();
  const sessionMiddleware = session({
    secret: process.env.SESSION_COOKIE_SECRET,
    store: new TypeormStore({ repository: sessionRepository }),
    resave: false,
    saveUninitialized: false,
  });
  socketLoader(httpServer, sessionMiddleware);
  expressLoader(app, sessionMiddleware);
};
