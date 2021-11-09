interface MESSAGES {
  [MESSAGE: string]: string;
}

const SIGN_UP_ERROR_MESSAGE: MESSAGES = {
  PASSWORD_FORM_ERROR:
    '비밀번호는 8자 이상 영대문자, 영소문자, 숫자, 특수문자를 최소 1개씩 포함하여야합니다.',
  ID_FORM_ERROR: 'ID는 영소문자로 시작하는 6~15자의 영소문자 또는 숫자 여야 합니다.',
  ID_REGISTER_ERROR: '이미 사용중인 ID 입니다.',
  USERNAME_ERROR: '유저 이름은 공백없이 1~15자여야 합니다.',
  EMPTY_INPUT_ERROR: '회원가입에 필요한 데이터를 모두 입력해주세요.',
};

const SIGN_IN_ERROR_MESSAGE: MESSAGES = {
  ID_EMPTY_ERROR: '아이디를 입력해주세요.',
  PASSWORD_EMPTY_ERROR: '비밀번호를 입력해주세요.',
};

export { SIGN_UP_ERROR_MESSAGE, SIGN_IN_ERROR_MESSAGE };
