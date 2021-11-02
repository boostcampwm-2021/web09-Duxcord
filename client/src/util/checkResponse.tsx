const checkPassword = (status:number, responseMessage:string):string => {
  const passwordWrongMessage:string = '비밀먼호는 특수문자 포함 6자 이상으로 해주세요.'
  if (status === 400 && responseMessage === passwordWrongMessage) {
    return passwordWrongMessage;
  }
  return '';
}

const checkID = (status:number, responseMessage:string):string => {
  const IDWrongMessage:string = '이미 사용중인 ID 입니다.'
  if (status === 400 && responseMessage === IDWrongMessage) {
    return IDWrongMessage;
  }
  return '';
}

const checkForm = (status:number, responseMessage:string):string => {
  const formWrongMessage:string = '회원가입에 필요한 데이터일부가 누락되었습니다.'
  if (status === 400 && responseMessage === formWrongMessage) {
    return formWrongMessage;
  }
  return '';
}

export {
  checkPassword,
  checkID,
  checkForm
}