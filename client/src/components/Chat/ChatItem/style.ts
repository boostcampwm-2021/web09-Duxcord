import styled from 'styled-components';
import Colors from '../../../styles/Colors';

const ChatWrapper = styled.div`
  background-color: ${Colors.White};
  z-index: 0;
  display: grid;
  grid-template-columns: 60px auto;
  padding: 20px 28px;
  position: relative;
  &:hover {
    background-color: ${Colors.Gray5};
  }
`;

const UserImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  object-fit: cover;
`;

const FileWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  color: ${Colors.Gray1};
  margin-bottom: 8px;

  & > div:first-child {
    font-weight: 600;
    font-size: 16px;
    color: ${Colors.Black};
    margin-right: 5px;
  }
  & > div:last-child {
    font-size: 13px;
    line-height: 16px;
  }
`;

const ChatContent = styled.div`
  white-space: normal;
  word-break: break-all;
`;

export { ChatWrapper, UserImage, FileWrapper, ChatHeader, ChatContent };
