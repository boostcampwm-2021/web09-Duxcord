import styled from 'styled-components';
import Colors from '../../../styles/Colors';

const ChannelWrapper = styled.div`
  margin-top: 20px;
`;

const ChannelType = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  &:hover {
    cursor: pointer;
    & div {
      color: ${Colors.Black};
    }
  }
  & div {
    display: flex;
    align-items: center;
    font-size: 12px;
    font-weight: bold;
    color: ${Colors.Gray1};
    & svg {
      width: 8px;
      height: 8px;
      margin-right: 8px;
    }
  }
`;

export { ChannelWrapper, ChannelType };
