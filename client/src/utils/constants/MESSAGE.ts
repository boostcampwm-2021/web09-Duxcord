interface MESSAGES {
  [MESSAGE: string]: string;
}

const SIGN_UP_ERROR_MESSAGE: MESSAGES = {
  PASSWORD_FORM_ERROR:
    '비밀번호는 8자 이상 영대소문자, 숫자, 특수문자를 최소 1개씩 포함하여야합니다.',
  ID_FORM_ERROR: 'ID는 영소문자로 시작하는 6~15자의 영소문자 또는 숫자 여야 합니다.',
  ID_REGISTER_ERROR: '이미 사용중인 ID 입니다.',
  USERNAME_ERROR: '유저 이름은 공백없이 1~15자여야 합니다.',
  EMPTY_INPUT_ERROR: '회원가입에 필요한 데이터를 모두 입력해주세요.',
};

const SIGN_IN_ERROR_MESSAGE: MESSAGES = {
  ID_EMPTY_ERROR: '아이디를 입력해주세요.',
  PASSWORD_EMPTY_ERROR: '비밀번호를 입력해주세요.',
};

const TOAST_MESSAGE = {
  ERROR: {
    COMMON: '요청이 실패했습니다.',
    FILE_UPLOAD: '파일 업로드에 실패했습니다.',
    INVALID_TYPE: '유효하지 않은 파일 형식입니다.',
    GROUP_CREATE: '그룹 생성에 실패했습니다.',
    GROUP_DELETE: '그룹 삭제에 실패했습니다.',
    GROUP_CODE_COPY: '그룹 코드 복사에 실패했습니다.',
    GROUP_INVITATION: '그룹 참가에 실패했습니다.',
    GROUP_INVALID_CODE: '유효하지 않은 그룹코드입니다.',
    CHANNEL_CREATE: '채널 생성에 실패했습니다.',
    CHANNEL_DELETE: '채널 삭제에 실패했습니다.',
    PROFILE_EDIT: '프로필 수정에 실패했습니다.',
    CAPTURE: {
      COMMON: '화면 캡쳐에 실패했습니다.',
      NO_VIDEO: '비디오를 킨 사용자가 없습니다.',
      NOT_SUPPORTED_BROWSER: '캡쳐 기능을 지원하지 않는 브라우저입니다.',
    },
    POST_CHAT_FAIL: '메시지 전송에 실패했습니다.',
  },
  SUCCESS: {
    COMMON: '요청이 성공했습니다.',
    FILE_UPLOAD: '파일 업로드에 성공했습니다',
    GROUP_CREATE: '그룹 생성에 성공했습니다.',
    GROUP_DELETE: '그룹 삭제에 성공했습니다.',
    GROUP_CODE_COPY: '그룹 코드가 복사되었습니다.',
    GROUP_INVITATION: '그룹 참가에 성공했습니다.',
    CHANNEL_CREATE: '채널 생성에 성공했습니다.',
    CHANNEL_DELETE: '채널 삭제에 성공했습니다.',
    PROFILE_EDIT: '프로필 수정에 성공했습니다.',
    LOGOUT: '로그아웃되었습니다.',
    CAPTURE: '화면 캡쳐에 성공했습니다. 이미지가 저장됩니다.',
  },
};

export { SIGN_UP_ERROR_MESSAGE, SIGN_IN_ERROR_MESSAGE, TOAST_MESSAGE };
