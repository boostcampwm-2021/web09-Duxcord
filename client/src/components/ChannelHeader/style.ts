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
    overflow-x: hidden;
    overflow-y: hidden;
    max-width: 400px;
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

  & > div:last-child {
    background-color: ${Colors.Gray3};
    font-weight: 500;
    padding: 5px;
    cursor: pointer;
    transition: 0.5s all;
    border-radius: 5px;
    &:hover {
      & > p {
        color: ${Colors.White};
      }
      border-radius: 10px;
      background-color: ${Colors.DarkRed};
    }
  }
`;

export { ChannelHeaderWrapper, ChannelHeaderLeft, ChannelHeaderRight };
