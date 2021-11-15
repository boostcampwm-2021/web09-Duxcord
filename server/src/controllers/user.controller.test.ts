import request from 'supertest';

import { appInit } from '..';
import { userRepository } from '../loaders/orm.loader';
import { signInMSG } from './user.controller';

let app;

beforeAll(async () => {
  app = await appInit();
});

afterAll(async () => {
  await userRepository.delete({ loginID: 'unittest' });
});

describe('POST /user/signup', () => {
  const testUserData = { loginID: 'unittest', username: 'unittest', password: 'Unittest01!' };
  context('회원가입이 정상적으로 진행되었을 때(상태코드 200)', () => {
    it('회원가입 성공 메시지를 반환', (done) => {
      request(app)
        .post('/api/user/signup')
        .send(testUserData)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).toBe('회원가입에 성공했습니다.');
          done();
        });
    });
  });
  context('회원가입에 실패했을 때(상태코드 400)', () => {
    it('아이디가 중복된 경우', (done) => {
      request(app)
        .post('/api/user/signup')
        .send(testUserData)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).toBe('이미 사용중인 ID 입니다.');
          done();
        });
    });
  });
});

describe('POST /user/signin', () => {
  const testLoginData = { loginID: 'unittest', password: 'Unittest01!' };
  context('로그인이 정상적으로 진행되었을 때(상태코드 200)', () => {
    it('로그인 성공 메시지를 반환', (done) => {
      request(app)
        .post('/api/user/signin')
        .send(testLoginData)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).toBe(signInMSG.success);
          done();
        });
    });
  });
  context('로그인에 실패한 경우(상태코드 400)', () => {
    it('패스워드가 틀린 경우', (done) => {
      request(app)
        .post('/api/user/signin')
        .send({ ...testLoginData, password: 'wrong' })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).toBe(signInMSG.wrongPassword);
          done();
        });
    });
    it('존재하지 않는 유저인 경우', (done) => {
      request(app)
        .post('/api/user/signin')
        .send({ ...testLoginData, loginID: 'wrong' })
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).toBe(signInMSG.userNotFound);
          done();
        });
    });
  });
});
