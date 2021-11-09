import styled from 'styled-components';
import Colors from '../../../styles/Colors';

const Wrapper = styled.div`
  border-radius: 16px;
  background-color: ${Colors.Gray4};
  box-sizing: border-box;
  padding: 8px 12px;
  width: fit-content;
  margin-top: 12px;
  &:hover {
    cursor: pointer;
    background-color: ${Colors.Gray3};
  }
`;

export { Wrapper };
