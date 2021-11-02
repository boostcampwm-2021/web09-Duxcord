import styled from 'styled-components';
import color from '../../styles/colors';

const SignInWrapper = styled.div`
  display: flex;
  width: 1077px;
  height: 504px;
  border-radius: 25px;
  padding: 20px 30px;
  background-color : ${color.Gray6};
  border: 1px solid gray;
` 

const LogoWrapper = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  & > img{
    width: 278.11px;
    height: 278.11px;
  }
`

const InputPartWrapper = styled.div`
  width: 50%;
  height: 100%;
`

const Introduction = styled.div`
  & > p:first-child{
    height: 43px;
    font-size: 36px;
    font-weight: 600;
    color: ${color.Blue};
  }
  & > p:not(:first-child){
    font-size: 18px;
    height: 22px;
    color:${color.Gray2};
    position: relative;
    margin-top: 15px;
  }
`

const InputPart = styled.div`
  display: flex;
  flex-direction: column;
  margin-top:40px;
  & > input{
    border:1px solid gray;
    height: 47px;
    border-radius: 10px;
    margin-top: 5px;
    background-color: ${color.White};
    font-size: 18px;
    padding: 0 10px;
    &:-webkit-autofill {
      box-shadow: 0 0 0 30px inset ${color.White};
    }
    &:-webkit-autofill::first-line {
      font-size: 18px;
    }
  }
`

const SignUpPart = styled.div`
  display: flex;
  font-size:18px;
  margin-top: 40px;
  & > p:not(:first-child){
    margin-left: 30px;
    color: ${color.Blue};
    :hover{
      cursor: pointer;
    }
  }
`

const LoginButton = styled.div`
  margin-top: 10px;
  height: 48.3px;
  border-radius: 15px;
  background-color: ${color.Blue};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color:${color.White};
  box-shadow: 2.5px 2.5px 5px gray;
  :hover{
    cursor: pointer;  
  }
`

const ErrorResponse = styled.p`
  margin-top: 10px;
  color: ${color.DarkRed};
`

export {
  SignInWrapper,
  LogoWrapper,
  InputPartWrapper,
  Introduction,
  InputPart,
  SignUpPart,
  LoginButton,
  ErrorResponse
};