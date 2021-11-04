import { postFetchOptions } from "./fetchOptions"

const tryLogin = async (loginID: string, password: string) => {
  const response = await fetch(
    'http://localhost:8000/api/user/signin',
    postFetchOptions({ loginID, password })
  )
  const responseText = await response.text();
  
  return {status: response.status, responseText};
}

export {
  tryLogin
}