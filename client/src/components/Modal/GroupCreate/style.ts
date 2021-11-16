import styled from 'styled-components';
import Colors from '../../../styles/Colors';

const InputText = styled.input`
  padding: 12px;
  border-radius: 6px;
  border: none;
  background-color: ${Colors.Gray3};
  width: 100%;
`;

const InputImage = styled.div`
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
  border-radius: 50px;
  border: 4px ${Colors.Gray1} dashed;
  position: relative;
  background-repeat: no-repeat;
  background-position-x: center;
  background-position-y: center;
  background-size: cover;

  & svg {
    position: absolute;
    width: 92px;
    top: 10px;
    left: 0;
    z-index: -1;
  }
`;

const InputForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export { InputText, InputImage, InputForm };
