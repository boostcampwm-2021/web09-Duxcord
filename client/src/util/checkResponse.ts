const checkLogin = (status:number, responseMessage:string):string => {
  if (status !== 200) {
    return responseMessage;
  }
  return '';
}

const validateID = (ID:string):boolean => {
  const loginIDRegex = /^[a-z][a-z0-9]{5,14}$/;
  return loginIDRegex.test(ID);
}

const validateUserName = (userName:string):boolean => {
  const userNameRegex = /^[^\s]{1,15}$/;
  return userNameRegex.test(userName);
}

const validatePassword = (password:string):boolean => {
  const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
  return passwordRegex.test(password);
}

const validateForm = (ID:string, userName:string, password:string):boolean => {
  if (ID === '' || userName === '' || password === '') return false
  return true
}

const isSendPossible = (IDResponseText:string, userNameResponseText:string, passwordResponseText:string):boolean => {
  if (IDResponseText === '' && userNameResponseText === '' && passwordResponseText === '') return true
  return false
}

export {
  checkLogin,
  validateID,
  validateUserName,
  validatePassword,
  validateForm,
  isSendPossible
}