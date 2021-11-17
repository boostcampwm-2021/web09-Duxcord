import styled from 'styled-components';
import Colors from '../../styles/Colors';

const ChatPart = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  width: 70%;
`;

const Chats = styled.div`
  overflow: overlay;
  flex: 1;
  height: calc(100vh - 108px);

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

export { ChatContainer, Chats, ChatPart };
