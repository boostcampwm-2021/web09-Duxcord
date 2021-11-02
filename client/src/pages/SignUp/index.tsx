import React,{useState} from 'react';
import BackgroundLayout from '../../layouts/BackgroundLayout'
import {
  SignUpWrapper
} from './style';

function SignUp() {

  return (
    <BackgroundLayout>
      <SignUpWrapper>
        <h1>계정 만들기</h1>
        <div>
          <label htmlFor="user_id">아이디</label>
          <input id="user_id" type="text" />
          <p>이미 사용중인 아이디 입니다.</p>
        </div>
        <div>
          <label htmlFor="user_name">사용자명</label>
          <input id="user_name" type="text" />
        </div>
        <div>
        <label htmlFor="user_password">비밀번호</label>
          <input id="user_password" type="password" />
          <p>비밀먼호는 특수문자 포함 6자 이상으로 해주세요.</p>
        </div>
        <div>
          <button>
              <p>가입하기</p>
          </button>
          <div>이미 계정이 있으신가요?</div>
        </div>
      </SignUpWrapper>
    </BackgroundLayout>
  );
}

export default SignUp;
