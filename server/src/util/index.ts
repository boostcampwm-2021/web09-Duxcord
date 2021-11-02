import { Request, Response, NextFunction } from 'express';

export const accessControl =
  ({ signIn = true }: { signIn: boolean } = { signIn: true }) =>
  (req: Request, res: Response, next: NextFunction) => {
    const isSignIn = req.session.userID !== undefined;
    if ((signIn === true && isSignIn === true) || (signIn === false && isSignIn === false)) {
      return next();
    } else {
      return res
        .status(400)
        .send(`로그인${signIn ? '되지 않은' : '된'} 사용자는 접근할 수 없습니다.`);
    }
  };
