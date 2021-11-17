import styled from 'styled-components';
import Colors from '../../../styles/Colors';

const Wrapper = styled.form`
  background-color: ${Colors.White};
  display: grid;
  gap: 2px;
  grid-template-columns: 40px auto;
  padding: 0 20px 18px 20px;
  width: 100%;
`;

const ButtonWrapper = styled.div`
  background-color: ${Colors.Gray2};
  border-bottom-left-radius: 12px;
  border-top-left-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`;

const InputWrapper = styled.div`
  background-color: ${Colors.Gray2};
  padding: 12px;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  box-sizing: border-box;
  width: 100%;
  & > input {
    outline: none;
    border: none;
    width: 100%;
    background-color: inherit;
  }
  & > div {
    width: 400px;
    display: flex;
    overflow: overlay;
    &::-webkit-scrollbar {
      display: none;
    }
    & img {
      width: 120px;
      height: 120px;
      margin-right: 10px;
    }
  }
`;

export { Wrapper, InputWrapper, ButtonWrapper };
