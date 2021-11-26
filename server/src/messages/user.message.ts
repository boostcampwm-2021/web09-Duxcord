export const signUpMSG = {
  nullInput: '회원가입에 필요한 데이터를 모두 입력해주세요.',
  invalidLoginID: 'ID는 영소문자로 시작하는 6~15자의 영소문자 또는 숫자 여야 합니다.',
  invalidUsername: '유저 이름은 공백없이 1~15자여야 합니다.',
  invalidPassword:
    '비밀번호는 8자 이상 영대문자, 영소문자, 숫자, 특수문자를 최소 1개씩 포함하여야합니다.',
  usedID: '이미 사용중인 ID 입니다.',
  success: '회원가입에 성공했습니다.',
};

export const signInMSG = {
  userNotFound: '존재하지 않는 회원입니다.',
  wrongPassword: '비밀번호가 올바르지 않습니다.',
  success: '로그인 성공!',
};

export const signOutMSG = {
  success: '로그아웃 성공!',
};

export const getUserGroupsMSG = {
  userNotFound: '존재하지 않는 유저입니다.',
};

export const updateUserDataMSG = {
  needUsername: '사용자 이름이 필요합니다.',
  needThumbnail: '사용자 이미지가 필요합니다.',
  needBio: '사용자 소개가 필요합니다.',
  invalidThumbnial: '사용자 이미지 주소가 올바르지 않습니다.',
  userNotFound: '존재하지 않는 유저입니다.',
};
