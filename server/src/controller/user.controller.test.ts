import request from 'supertest';

import { appInit } from '..';
import { userRepository } from '../db';

let app;

beforeAll(async () => {
  app = await appInit();
});

afterAll(async () => {
  await userRepository.delete({ loginID: 'unit' });
});

describe('POST /user/signup', () => {
  context('회원가입이 정상적으로 진행되었을 때(상태코드 200)', () => {
    it('회원가입 성공 메시지를 반환', (done) => {
      request(app)
        .post('/api/user/signup')
        .send({ loginID: 'unit', username: 'unit', password: 'unit' })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).toBe('회원가입에 성공했습니다.');
          done();
        });
    });
  });
  context('회원가입에 실패했을 때(상태코드 400)', () => {
    it('아이디가 중복된 경우.', (done) => {
      request(app)
        .post('/api/user/signup')
        .send({ loginID: 'unit', username: 'unit', password: 'unit' })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).toBe('이미 사용중인 ID 입니다.');
          done();
        });
    });
  });
});
