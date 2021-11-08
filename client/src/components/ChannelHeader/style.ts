import styled from 'styled-components';
import Colors from '../../styles/Colors';

const ChannelHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 11.5px;
  border-bottom: 1px solid ${Colors.Gray4};
  & div {
    display: flex;
    align-items: center;
  }
`;

const ChannelHeaderLeft = styled.div`
  & img {
    margin-right: 10px;
  }
  & p {
    font-size: 16px;
    font-weight: bold;
  }
`;

const ChannelHeaderRight = styled.div`
  & div {
    margin-left: 20px;
    & img {
      margin: 0 5px;
    }
  }
  & p {
    color: ${Colors.Gray1};
    font-weight: 500;
  }
`;

export { ChannelHeaderWrapper, ChannelHeaderLeft, ChannelHeaderRight };
