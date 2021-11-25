import styled from 'styled-components';
import Colors from '@styles/Colors';

const ChannelMeetingCountWrapper = styled.div`
  background-color: ${Colors.White};
  padding: 3px 7px;
  border-radius: 5px;
  & p {
    font-size: 14px;
    font-weight: normal;
    color: ${Colors.Gray1};
    & span:nth-child(2) {
      margin: 0 2px;
    }
  }
`;

export { ChannelMeetingCountWrapper };
