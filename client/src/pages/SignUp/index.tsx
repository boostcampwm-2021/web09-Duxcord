import React,{ useState } from 'react';
import BackgroundLayout from '../../layouts/BackgroundLayout'

import { 
  checkID,
  checkPassword,
  checkForm
 } from '../../util/checkResponse';
import {
  SignUpWrapper,
  Title,
  InputPart,
  ErrorResponse,
  SignUpButton,
  ButtonWrapper
} from './style';

function SignUp() {

  const [inputState, setInputState] = useState({
    ID:'',
    userName:'',
    password:''
  })

  const [responseState, setResponseState] = useState({
    status:0,
    responseText:'',
  })

  const {ID, userName, password} = inputState
  const {status, responseText} = responseState;

  const handleIDInputChange = (event: React.FormEvent<HTMLInputElement>):void => {
    setInputState({
      ...inputState,
      ID: event.currentTarget.value
    })
  }

  const handleUserNameInputChange = (event: React.FormEvent<HTMLInputElement>):void => {
    setInputState({
      ...inputState,
      userName: event.currentTarget.value
    })
  }

  const handlePasswordInputChange = (event: React.FormEvent<HTMLInputElement>):void => {
    setInputState({
      ...inputState,
      password: event.currentTarget.value
    })
  }

  const signIn = async () => {
    const response = await fetch('http://localhost:8000/api/user/signup', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      "loginID": ID,
      "username": userName,
      "password": password
      })
    })
    const responseText = await response.text()
    setResponseState({
      ...responseState,
      status : response.status,
      responseText:responseText
    })
  }

  return (
    <BackgroundLayout>
      <SignUpWrapper>
        <Title>계정 만들기</Title>
        <InputPart>
          <label htmlFor="user_id">아이디</label>
          <input id="user_id" type="text" value={ID} onInput={handleIDInputChange}/>
          <ErrorResponse>{checkID(status, responseText)}</ErrorResponse>
        </InputPart>
        <InputPart>
          <label htmlFor="user_name">사용자명</label>
          <input id="user_name" type="text" value={userName} onInput={handleUserNameInputChange}/>
        </InputPart>
        <InputPart>
        <label htmlFor="user_password">비밀번호</label>
          <input id="user_password" type="password" value={password} onInput={handlePasswordInputChange}/>
          <ErrorResponse>{checkPassword(status,responseText)}</ErrorResponse>
          <ErrorResponse>{checkForm(status,responseText)}</ErrorResponse>
        </InputPart>
        <ButtonWrapper>
          <SignUpButton onClick={signIn}>
            <p>가입하기</p>
          </SignUpButton>
          <div>이미 계정이 있으신가요?</div>
        </ButtonWrapper>
      </SignUpWrapper>
    </BackgroundLayout>
  );
}

export default SignUp;
