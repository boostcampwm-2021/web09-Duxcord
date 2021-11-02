import React,{useState} from 'react';
import useSWR from 'swr'
import BackgroundLayout from '../../layouts/BackgroundLayout'
import { Link } from 'react-router-dom';

import {
  SignInWrapper,
  LogoWrapper,
  InputPartWrapper,
  Introduction,
  InputPart,
  SignUpPart,
  LoginButton,
  ErrorResponse
} from './style';

const fetcher = (url: string) => fetch(url,{
  method:'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body:JSON.stringify({
    loginID: 'test',
    password: '123',
  })
}).then(res => res.json())

function SignIn() {
  // const { data, error } = useSWR('/api/signin', fetcher)
  const [inputState,setInputState] = useState({
    ID:'',
    password:''
  })

  const { ID, password } = inputState

  const handleIDInputChange = (event: React.FormEvent<HTMLInputElement>):void => {
    setInputState({
      ...inputState,
      ID: event.currentTarget.value
    })
  }

  const handlePasswordInputChange = (event: React.FormEvent<HTMLInputElement>):void => {
    setInputState({
      ...inputState,
      password: event.currentTarget.value
    })
  }

  return (
    <BackgroundLayout>

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
            <input type="password" id="user_password" value={password} onInput={handlePasswordInputChange}></input>
          </InputPart>
          <ErrorResponse>존재하지 않는 유저입니다.</ErrorResponse>
          <SignUpPart>
            <p>계정이 필요한가요?</p>
            <Link to='/SignUp'><p>가입하기</p></Link>
          </SignUpPart>
          <LoginButton>
          <Link to='/Main'><p>로그인</p></Link>
          </LoginButton>
        </InputPartWrapper>
        <LogoWrapper>
          <img src="duxcord_logo.png" alt="duxcord_logo"/>
        </LogoWrapper>
      </SignInWrapper>
    </BackgroundLayout>
  );
}

export default SignIn;
