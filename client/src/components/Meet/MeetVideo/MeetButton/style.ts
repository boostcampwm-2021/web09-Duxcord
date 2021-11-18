import styled from 'styled-components';
import Colors from '../../../../styles/Colors';

const MeetButtonWrapper = styled.div`
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
  & button {
    width: 60px;
    height: 60px;
    border: none;
    border-radius: 50%;
    margin: 10px;
    cursor: pointer;
    &:first-child {
      background-color: ${Colors.Gray1};
    }
    &:last-child {
      background-color: ${Colors.DarkRed};
    }
  }
`;

export { MeetButtonWrapper };
