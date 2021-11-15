import styled from 'styled-components';
import Colors from '../../../styles/Colors';

const Wrapper = styled.form`
  background-color: ${Colors.White};
  display: grid;
  gap: 2px;
  grid-template-columns: 40px auto;
  padding: 0 20px 18px 20px;
`;

const ButtonWrapper = styled.div`
  background-color: ${Colors.Gray2};
  border-bottom-left-radius: 12px;
  border-top-left-radius: 12px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`;

const Input = styled.input`
  background-color: ${Colors.Gray2};
  padding: 12px;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  height: 40px;
  outline: none;
  border: none;
  box-sizing: border-box;
`;

export { Wrapper, Input, ButtonWrapper };
