import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { SIGN_IN_ERROR_MESSAGE, URL, STATUS_CODES } from '@utils/constants/index';
import { checkLogin } from '@utils/index';
import { postSignIn } from '@api/index';
import Background from '@components/common/Background';
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

const { ID_EMPTY_ERROR, PASSWORD_EMPTY_ERROR } = SIGN_IN_ERROR_MESSAGE;

function SignIn() {
  const history = useHistory();
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

  const signIn = async () => {
    if (ID === '') return setResponseState({ ...responseState, responseText: ID_EMPTY_ERROR });
    if (password === '')
      return setResponseState({ ...responseState, responseText: PASSWORD_EMPTY_ERROR });

    try {
      const loginResponse = await postSignIn(ID, password);
      setResponseState({ ...responseState, ...loginResponse });
      if (loginResponse.status === STATUS_CODES.OK) history.replace(URL.GROUP());
    } catch (error) {
      console.log(error);
    }
  };

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
            <Link to="/signup" replace>
              <p>가입하기</p>
            </Link>
          </SignUpPart>
          <LoginButton onClick={signIn}>
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
