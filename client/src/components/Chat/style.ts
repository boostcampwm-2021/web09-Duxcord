import styled from 'styled-components';
import Colors from '../../styles/Colors';

const ChatPart = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const ChatContainer = styled.div`
  width: 70%;
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Chats = styled.div`
  overflow: overlay;

  &::-webkit-scrollbar {
    display: none;
  }

  &::-webkit-scrollbar-thumb {
    background: ${Colors.Gray2};
    border-radius: 10px;
  }

  &:hover::-webkit-scrollbar {
    display: block;
    width: 15px;
  }
`;

const ChatInputWrapper = styled.div`
  width: 100%;
`;

export { ChatContainer, Chats, ChatPart, ChatInputWrapper };
