import styled from 'styled-components';
import Colors from '../../styles/Colors';

const SignUpWrapper = styled.div`
  width: 620.79px;
  height: 700.66px;
  background-color: ${Colors.Gray6};
  border-radius: 25px;
  border: 1px solid ${Colors.Gray1};
  padding: 80px 40px 0;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 36px;
  color: ${Colors.Blue};
  font-weight: 600;
  margin-bottom: 50px;
`;

const InputPart = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 50px;
  & > p {
    height: 18px;
    margin-top: 6px;
    margin-bottom: -18px;
    color: ${Colors.DarkRed};
  }
  & > p:not(:last-child) {
    margin-bottom: 18px;
  }
  & > input {
    border: 1px solid gray;
    height: 47px;
    border-radius: 10px;
    margin-top: 5px;
    background-color: ${Colors.White};
    font-size: 18px;
    padding: 0 10px;
    &:-webkit-autofill {
      box-shadow: 0 0 0 30px inset ${Colors.White};
    }
    &:-webkit-autofill::first-line {
      font-size: 18px;
    }
  }
`;
const ErrorResponse = styled.p``;

const SignUpButton = styled.div`
  margin-top: 10px;
  height: 48.3px;
  border-radius: 15px;
  background-color: ${Colors.Blue};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: ${Colors.White};
  box-shadow: 2.5px 2.5px 5px gray;
  :hover {
    cursor: pointer;
  }
`;

const ButtonWrapper = styled.div`
  margin-top: 40px;
  & > div:not(:first-child) {
    & > a {
      color: ${Colors.Blue};
      text-decoration: none;
    }
    margin-top: 10px;
    cursor: pointer;
  }
`;

export { SignUpWrapper, Title, InputPart, ErrorResponse, SignUpButton, ButtonWrapper };
