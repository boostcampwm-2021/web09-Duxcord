import { postFetchOptions } from "./fetchOptions"

const tryLogin = async (loginID: string, password: string) => {
  const response = await fetch(
    '/api/user/signin',
    postFetchOptions({ loginID, password })
  )
  const responseText = await response.text();
  
  return {status: response.status, responseText};
}

const trySignUp = async (loginID:string, username:string, password:string) => {
  const response = await fetch(
    '/api/user/signup', 
    postFetchOptions({loginID, username, password})
  )
  const responseText = await response.text();

  return {status: response.status, responseText};
}

export {
  tryLogin,
  trySignUp
}