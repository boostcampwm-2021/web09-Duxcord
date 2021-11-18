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
`;

const FileWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  & img {
    max-width: 300px;
    height: 120px;
    margin-right: 10px;
  }
`;

const ChatHeader = styled.div`
  display: flex;
  gap: 12px;
  color: ${Colors.Gray1};
  margin-bottom: 8px;

  & > div:first-child {
    font-weight: 600;
    font-size: 15px;
    color: ${Colors.Black};
  }
`;

const ChatContent = styled.div`
  white-space: normal;
  word-break: break-all;
`;

export { ChatWrapper, UserImage, FileWrapper, ChatHeader, ChatContent };
