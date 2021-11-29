import { accessControl } from './access-control.middleware';
import { Request, Response, NextFunction } from 'express';

describe('accessControl', () => {
  const mockRequest = (value: boolean): Request => {
    const req = {
      isAuthenticated: jest.fn(() => value),
      session: {
        userID: 'banana',
      },
    } as unknown;
    return req as Request;
  };

  const mockResponse = (): Response => {
    const res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    } as unknown;
    return res as Response;
  };

  beforeEach(() => jest.clearAllMocks());

  it('signIn이 true일 경우 next가 실행된다.', () => {
    const req = mockRequest(true);
    const res = mockResponse();
    const next = jest.fn();
    accessControl()(req, res, next);
    expect(next).toBeCalled();
  });

  it('singIn이 false일 경우 next가 실행되지 않는다.', () => {
    const req = mockRequest(false);
    const res = mockResponse();
    const next = jest.fn();
    accessControl({ signIn: false })(req, res, next);
    expect(next).not.toBeCalled();
  });
});
