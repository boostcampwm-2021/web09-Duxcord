import React,{useState} from 'react';
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

  return (
    <BackgroundLayout>
      <SignUpWrapper>
        <Title>계정 만들기</Title>
        <InputPart>
          <label htmlFor="user_id">아이디</label>
          <input id="user_id" type="text" />
          <ErrorResponse>이미 사용중인 아이디 입니다.</ErrorResponse>
        </InputPart>
        <InputPart>
          <label htmlFor="user_name">사용자명</label>
          <input id="user_name" type="text" />
        </InputPart>
        <InputPart>
        <label htmlFor="user_password">비밀번호</label>
          <input id="user_password" type="password" />
          <ErrorResponse>비밀먼호는 특수문자 포함 6자 이상으로 해주세요.</ErrorResponse>
        </InputPart>
        <ButtonWrapper>
          <SignUpButton>
              <p>가입하기</p>
          </SignUpButton>
          <div>이미 계정이 있으신가요?</div>
        </ButtonWrapper>
      </SignUpWrapper>
    </BackgroundLayout>
  );
}

export default SignUp;
