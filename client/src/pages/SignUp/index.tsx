import React, { useState } from 'react';
import Background from '@components/common/Background';
import { Redirect, Link } from 'react-router-dom';

import {
  validateID,
  validateUserName,
  validatePassword,
  validateForm,
  isSendPossible,
} from '../../utils/checkResponse';
import {
  SignUpWrapper,
  Title,
  InputPart,
  ErrorResponse,
  SignUpButton,
  ButtonWrapper,
} from './style';
import { SIGN_UP_ERROR_MESSAGE } from '../../utils/message';
import { trySignUp } from '../../utils/api';

const { ID_FORM_ERROR, PASSWORD_FORM_ERROR, USERNAME_ERROR, EMPTY_INPUT_ERROR } =
  SIGN_UP_ERROR_MESSAGE;

function SignUp() {
  const [inputState, setInputState] = useState({
    ID: '',
    userName: '',
    password: '',
  });

  const [responseState, setResponseState] = useState({
    status: 0,
    IDresponseText: '',
    userNameResponseText: '',
    passwordResponseText: '',
    formResponseText: '',
  });

  const { ID, userName, password } = inputState;
  const { status, IDresponseText, userNameResponseText, passwordResponseText, formResponseText } =
    responseState;

  const handleIDInputChange = (event: React.FormEvent<HTMLInputElement>): void => {
    const input = event.currentTarget.value;
    setInputState({ ...inputState, ID: input });
    const nowFormResopnseText = validateForm(input, userName, password) ? '' : formResponseText;
    const nowIDresponseText = validateID(input) ? '' : ID_FORM_ERROR;
    setResponseState({
      ...responseState,
      formResponseText: nowFormResopnseText,
      IDresponseText: nowIDresponseText,
    });
  };

  const handleUserNameInputChange = (event: React.FormEvent<HTMLInputElement>): void => {
    const input = event.currentTarget.value;
    setInputState({ ...inputState, userName: input });
    const nowFormResopnseText = validateForm(ID, input, password) ? '' : formResponseText;
    const nowUserNameResponseText = validateUserName(input) ? '' : USERNAME_ERROR;
    setResponseState({
      ...responseState,
      formResponseText: nowFormResopnseText,
      userNameResponseText: nowUserNameResponseText,
    });
  };

  const handlePasswordInputChange = (event: React.FormEvent<HTMLInputElement>): void => {
    const input = event.currentTarget.value;
    setInputState({ ...inputState, password: input });
    const nowFormResopnseText = validateForm(ID, userName, input) ? '' : formResponseText;
    const nowPasswordResponseText = validatePassword(input) ? '' : PASSWORD_FORM_ERROR;
    setResponseState({
      ...responseState,
      formResponseText: nowFormResopnseText,
      passwordResponseText: nowPasswordResponseText,
    });
  };

  const signUp = async () => {
    if (!ID || !userName || !password)
      return setResponseState({ ...responseState, formResponseText: EMPTY_INPUT_ERROR });
    if (!isSendPossible(IDresponseText, userNameResponseText, passwordResponseText)) return;
    const { status, responseText } = await trySignUp(ID, userName, password);
    setResponseState({ ...responseState, status, IDresponseText: responseText });
  };

  if (status === 200) {
    return <Redirect to="/" />;
  }

  return (
    <Background>
      <SignUpWrapper>
        <Title>계정 만들기</Title>
        <InputPart>
          <label htmlFor="user_id">아이디</label>
          <input id="user_id" type="text" value={ID} onInput={handleIDInputChange} />
          <ErrorResponse>{IDresponseText}</ErrorResponse>
        </InputPart>
        <InputPart>
          <label htmlFor="user_name">사용자명</label>
          <input id="user_name" type="text" value={userName} onInput={handleUserNameInputChange} />
          <ErrorResponse>{userNameResponseText}</ErrorResponse>
        </InputPart>
        <InputPart>
          <label htmlFor="user_password">비밀번호</label>
          <input
            id="user_password"
            type="password"
            value={password}
            onInput={handlePasswordInputChange}
          />
          <ErrorResponse>{passwordResponseText}</ErrorResponse>
          <ErrorResponse>{formResponseText}</ErrorResponse>
        </InputPart>
        <ButtonWrapper>
          <SignUpButton onClick={signUp}>
            <p>가입하기</p>
          </SignUpButton>
          <div>
            <Link to="/">이미 계정이 있으신가요?</Link>
          </div>
        </ButtonWrapper>
      </SignUpWrapper>
    </Background>
  );
}

export default SignUp;
