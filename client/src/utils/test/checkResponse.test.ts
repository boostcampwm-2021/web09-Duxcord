import {
  checkLogin,
  validateID,
  validateUserName,
  validatePassword,
  validateForm,
  isSendPossible,
} from '../checkResponse';

describe('checkResponse', () => {
  it('로그인이 성공했을 경우 checkLogin', () => {
    const response = { status: 200, message: '로그인 성공!' };
    const endPoint = checkLogin(response.status, response.message);
    expect(endPoint).toBe('');
  });

  it('로그인이 실패했을 경우 checkLogin', () => {
    const response = { status: 400, message: '로그인된 사용자는 접근할 수 없습니다.' };
    const endPoint = checkLogin(response.status, response.message);
    expect(endPoint).toBe('로그인된 사용자는 접근할 수 없습니다.');
  });

  it('식에 부합하는 아이디일 경우 validateID', () => {
    const id = 'seojin';
    const endPoint = validateID(id);
    expect(endPoint).toBeTruthy();
  });

  it('공백일 경우 validateID', () => {
    const id = '';
    const endPoint = validateID(id);
    expect(endPoint).toBeFalsy();
  });

  it('특수문자가 포함되었을 경우 validateID', () => {
    const id = 'seojin!!';
    const endPoint = validateID(id);
    expect(endPoint).toBeFalsy();
  });

  it('첫글자가 대문자일 경우 validateID', () => {
    const id = 'Seojin';
    const endPoint = validateID(id);
    expect(endPoint).toBeFalsy();
  });

  it('5자 이하일 경우 validateID', () => {
    const id = 'sj';
    const endPoint = validateID(id);
    expect(endPoint).toBeFalsy();
  });

  it('15자 이상일 경우 validateID', () => {
    const id = 'seojinseojinseojinseojin';
    const endPoint = validateID(id);
    expect(endPoint).toBeFalsy();
  });

  it('식에 부합하는 값일 경우 validateUserName', () => {
    const username = '김서진';
    const endPoint = validateUserName(username);
    expect(endPoint).toBeTruthy();
  });

  it('공백일 경우 validateUserName', () => {
    const username = '';
    const endPoint = validateUserName(username);
    expect(endPoint).toBeFalsy();
  });

  it('16자 이상일 경우 validateUserName', () => {
    const username = 'seojinseojinseojinseojin';
    const endPoint = validateUserName(username);
    expect(endPoint).toBeFalsy();
  });

  it('식에 부합하는 값일 경우 validatePassword', () => {
    const password = 'Seojin234!';
    const endPoint = validatePassword(password);
    expect(endPoint).toBeTruthy();
  });

  it('한글과 영어소문자, 숫자, 특수문자가 포함될 경우 validatePassword', () => {
    const password = '김서진abc123!';
    const endPoint = validatePassword(password);
    expect(endPoint).toBeTruthy();
  });

  it('특수문자를 포함하지 않은 경우 validatePassword', () => {
    const password = 'Seojin234';
    const endPoint = validatePassword(password);
    expect(endPoint).toBeFalsy();
  });

  it('숫자를 포함하지 않은 경우 validatePassword', () => {
    const password = 'Seojin!@$!';
    const endPoint = validatePassword(password);
    expect(endPoint).toBeFalsy();
  });

  it('영어 대문자만을 포함한 경우 validatePassword', () => {
    const password = 'SEOJINSEOJIN';
    const endPoint = validatePassword(password);
    expect(endPoint).toBeFalsy();
  });

  it('숫자만을 포함한 경우 validatePassword', () => {
    const password = '01071889075';
    const endPoint = validatePassword(password);
    expect(endPoint).toBeFalsy();
  });

  it('성공적일 경우 validateForm', () => {
    const formData = { ID: 'seojinseojin', userName: '김서진', password: 'seojin123!' };
    const endPoint = validateForm(formData.ID, formData.userName, formData.password);
    expect(endPoint).toBeTruthy();
  });

  it('form 중 한 값이 비었을 경우 validateForm', () => {
    const formData = { ID: '', userName: '김서진', password: 'seojin123!' };
    const endPoint = validateForm(formData.ID, formData.userName, formData.password);
    expect(endPoint).toBeFalsy();
  });

  it('form 중 두 값이 비었을 경우 validateForm', () => {
    const formData = { ID: '', userName: '', password: 'seojin123!' };
    const endPoint = validateForm(formData.ID, formData.userName, formData.password);
    expect(endPoint).toBeFalsy();
  });

  it('form 중 세 값이 비었을 경우 validateForm', () => {
    const formData = { ID: '', userName: '', password: '' };
    const endPoint = validateForm(formData.ID, formData.userName, formData.password);
    expect(endPoint).toBeFalsy();
  });

  it('성공적일 경우 isSendPossible', () => {
    const responseData = { IDResponseText: '', userNameResponseText: '', passwordResponseText: '' };
    const endPoint = isSendPossible(
      responseData.IDResponseText,
      responseData.userNameResponseText,
      responseData.passwordResponseText,
    );
    expect(endPoint).toBeTruthy();
  });

  it('IDResponseText에 값이 있을 경우 isSendPossible', () => {
    const responseData = {
      IDResponseText: '이미 사용중인 ID입니다.',
      userNameResponseText: '',
      passwordResponseText: '',
    };
    const endPoint = isSendPossible(
      responseData.IDResponseText,
      responseData.userNameResponseText,
      responseData.passwordResponseText,
    );
    expect(endPoint).toBeFalsy();
  });
});
