import React,{useCallback, useState} from 'react';
import BackgroundLayout from '../../layouts/BackgroundLayout'
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

  const {ID, userName, password} = inputState

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
    console.log(responseText)
  }

  return (
    <BackgroundLayout>
      <SignUpWrapper>
        <Title>계정 만들기</Title>
        <InputPart>
          <label htmlFor="user_id">아이디</label>
          <input id="user_id" type="text" value={ID} onInput={handleIDInputChange}/>
          <ErrorResponse>이미 사용중인 아이디 입니다.</ErrorResponse>
        </InputPart>
        <InputPart>
          <label htmlFor="user_name">사용자명</label>
          <input id="user_name" type="text" value={userName} onInput={handleUserNameInputChange}/>
        </InputPart>
        <InputPart>
        <label htmlFor="user_password">비밀번호</label>
          <input id="user_password" type="password" value={password} onInput={handlePasswordInputChange}/>
          <ErrorResponse>비밀먼호는 특수문자 포함 6자 이상으로 해주세요.</ErrorResponse>
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
