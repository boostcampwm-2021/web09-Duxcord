import { SIGN_UP_ERROR_MESSAGE } from '../util/message'

const {
  PASSWORD_FORM_ERROR,
  ID_FORM_ERROR,
  ID_REGISTER_ERROR,
  EMPTY_INPUT_ERROR
} = SIGN_UP_ERROR_MESSAGE;

const checkPassword = (status:number, responseMessage:string):string => {
  if (status === 400 && responseMessage === PASSWORD_FORM_ERROR) {
    return PASSWORD_FORM_ERROR;
  }
  return '';
}

const checkID = (status:number, responseMessage:string):string => {
  if (status === 400 && responseMessage in [ID_FORM_ERROR, ID_REGISTER_ERROR]) {
    return responseMessage;
  }
  return '';
}

const checkForm = (status:number, responseMessage:string):string => {
  if (status === 400 && responseMessage === EMPTY_INPUT_ERROR) {
    return EMPTY_INPUT_ERROR;
  }
  return '';
}

const checkLogin = (status:number, responseMessage:string):string => {
  if (status !== 200) {
    return responseMessage;
  }
  return '';
}

export {
  checkPassword,
  checkID,
  checkForm,
  checkLogin
}