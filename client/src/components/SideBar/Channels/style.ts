import styled from 'styled-components';
import colors from '../../../styles/colors';

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
      color: ${colors.Black};
    }
  }
  & div {
    display: flex;
    align-items: center;
    font-size: 12px;
    font-weight: bold;
    color: ${colors.Gray1};
    & img {
      width: 8px;
      height: 8px;
      margin-right: 8px;
    }
  }
`;

const ChannelList = styled.ul``;

export { ChannelWrapper, ChannelType, ChannelList };
