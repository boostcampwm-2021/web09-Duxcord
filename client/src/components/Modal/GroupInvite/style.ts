import styled from 'styled-components';
import Colors from '../../../styles/Colors';

const CodeWrapper = styled.div`
  padding: 16px 20px;
  background-color: ${Colors.Gray6};
  border-radius: 12px;
  margin: 12px 0;

  &:hover {
    cursor: pointer;
  }
`;

export { CodeWrapper };
