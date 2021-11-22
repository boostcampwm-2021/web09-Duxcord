import Colors from '@styles/Colors';
import styled from 'styled-components';

const AlertWrapper = styled.div`
  padding: 16px 20px;
  background-color: ${Colors.Gray6};
  border-radius: 12px;
  margin: 12px 0;
  font-size: 12px;
  & span {
    color: ${Colors.Red};
  }
`;

export { AlertWrapper };
