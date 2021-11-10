import styled from 'styled-components';
import Colors from '../../../styles/Colors';

const ChatThreadWrapper = styled.div`
  display: flex;
  margin-top: 5px;
  cursor: pointer;
  transition: 0.5s all;
  &:hover {
    background-color: ${Colors.Yellow};
  }
  & > img {
    margin-left: 5px;
    width: 15px;
    height: 15px;
    border-radius: 50%;
  }
  & > p:first-child {
    font-size: 14px;
    font-weight: 600;
    margin-right: 5px;
  }
  & > p:not(:first-child) {
    font-size: 12px;
    color: ${Colors.Gray2};
  }
`;

export { ChatThreadWrapper };
