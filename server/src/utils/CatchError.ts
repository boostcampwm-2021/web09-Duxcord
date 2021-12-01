import { NextFunction, Request, Response } from 'express';

function CatchError(target, propertyKey: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value;
  descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
    try {
      await method(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

class CustomError {
  message;
  status;
  constructor({ message, status }: { message; status: number }) {
    this.message = message;
    this.status = status;
  }
}

export { CatchError, CustomError };
