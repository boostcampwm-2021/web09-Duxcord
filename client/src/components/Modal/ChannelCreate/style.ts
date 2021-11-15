import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Label = styled.label`
  font-size: 20px;
  text-align: left;
`;

const Input = styled.input`
  height: 48px;
  box-sizing: border-box;
  border: 1px solid black;
  border-radius: 5px;
  padding: 8px;
`;

export { Label, Input, Wrapper };
