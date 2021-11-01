import styled from 'styled-components';

const SignInWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  width: 1077px;
  height: 504px;
  border-radius: 25px;
  padding: 20px 30px;
  background-color : #f2f3f5;
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
    color: #0055FB;
  }
  & > p:not(:first-child){
    font-size: 18px;
    height: 22px;
    color:gray;
    position: relative;
    bottom: 20px;
  }
`

const InputPart = styled.div`
  display: flex;
  flex-direction: column;
  margin-top:30px;
  & > input{
    border:1px solid gray;
    height: 47px;
    border-radius: 10px;
    margin-top: 5px;
    background-color: white;
    font-size: 18px;
    padding: 0 5px;
    input:-webkit-autofill {
      box-shadow: 0 0 0 1000px white inset;
    }
  }
`

const SignUpPart = styled.div`
  display: flex;
  font-size:18px;
  & > p:not(:first-child){
    margin-left: 30px;
    color: #0055FB;
    :hover{
      cursor: pointer;
    }
  }
`

const LoginButton = styled.div`
  height: 48.3px;
  border-radius: 15px;
  background-color: #0055FB;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color:white;
  box-shadow: 2.5px 2.5px 5px gray;
  :hover{
    cursor: pointer;  
  }
`

export {
  SignInWrapper,
  LogoWrapper,
  InputPartWrapper,
  Introduction,
  InputPart,
  SignUpPart,
  LoginButton
};