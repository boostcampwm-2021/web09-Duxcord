import React, { useState } from 'react';
import useSWR from 'swr';
import Background from '../../components/common/Background';
import { Redirect, Link } from 'react-router-dom';

import {
  SignInWrapper,
  LogoWrapper,
  InputPartWrapper,
  Introduction,
  InputPart,
  SignUpPart,
  LoginButton,
  ErrorResponse,
} from './style';
import { postFetchOptions } from '../../util/fetchOptions';
import { checkLogin } from '../../util/checkResponse';
import { getFetcher } from '../../util/fetcher';

function SignIn() {
  const { data, error, mutate } = useSWR('http://localhost:8000/api/user', getFetcher);
  const [inputState, setInputState] = useState({ ID: '', password: '' });
  const [responseState, setResponseState] = useState({ status: 0, responseText: '' });

  const { ID, password } = inputState;
  const { status, responseText } = responseState;

  const handleIDInputChange = (event: React.FormEvent<HTMLInputElement>): void => {
    setInputState({
      ...inputState,
      ID: event.currentTarget.value,
    });
  };

  const handlePasswordInputChange = (event: React.FormEvent<HTMLInputElement>): void => {
    setInputState({
      ...inputState,
      password: event.currentTarget.value,
    });
  };

  const logIn = async () => {
    if (ID === '')
      return setResponseState({ ...responseState, responseText: '아이디를 입력해주세요.' });
    if (password === '')
      return setResponseState({ ...responseState, responseText: '비밀번호를 입력해주세요.' });
    const response = await fetch(
      'http://localhost:8000/api/user/signin',
      postFetchOptions({
        loginID: ID,
        password: password,
      })
    );
    const responseText = await response.text();
    await mutate();
    setResponseState({
      ...responseState,
      status: response.status,
      responseText: responseText,
    });
  };

  if (data) {
    return <Redirect to="/Main" />;
  }

  return (
    <Background>
      <SignInWrapper className="App">
        <InputPartWrapper>
          <Introduction>
            <p>돌아오신 것을 환영해요!</p>
            <p>다시 만나다니 너무 반가워요!</p>
          </Introduction>
          <InputPart>
            <label htmlFor="user_id">아이디</label>
            <input type="text" id="user_id" value={ID} onInput={handleIDInputChange}></input>
          </InputPart>
          <InputPart>
            <label htmlFor="user_password">비밀번호</label>
            <input
              type="password"
              id="user_password"
              value={password}
              onInput={handlePasswordInputChange}
            ></input>
          </InputPart>
          <ErrorResponse>{checkLogin(status, responseText)}</ErrorResponse>
          <SignUpPart>
            <p>계정이 필요한가요?</p>
            <Link to="/SignUp">
              <p>가입하기</p>
            </Link>
          </SignUpPart>
          <LoginButton onClick={logIn}>
            <p>로그인</p>
          </LoginButton>
        </InputPartWrapper>
        <LogoWrapper>
          <img src="/images/duxcord_logo.png" alt="duxcord_logo" />
        </LogoWrapper>
      </SignInWrapper>
    </Background>
  );
}

export default SignIn;
