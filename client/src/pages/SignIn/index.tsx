import React from 'react';
import useSWR from 'swr'

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
  return (
    <div className="App">
      <div>
        <div>
          <p>돌아오신 것을 환영해요!</p>
          <p>다시 만나다니 너무 반가워요!</p>
        </div>
        <div>
          <div>
            <label htmlFor="user_id">아이디</label>
            <input type="text" id="user_id"></input>
          </div>
          <div>
            <label htmlFor="user_password">비밀번호</label>
            <input type="password" id="user_password"></input>
          </div>
          <div>
            <div>
              <p>계정이 필요한가요?</p>
              <p>가입하기</p>
            </div>
            <div>
              <p>로그인</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <img src="duxcord_logo.png" alt="duxcord_logo"/>
      </div>
    </div>
  );
}

export default SignIn;
