import styled from 'styled-components';
import colors from '../../styles/colors';

const ChatContainer = styled.div`
  flex: 1;
`;

const Chats = styled.div`
  overflow-y: scroll;
  flex: 1;
  height: calc(100vh - 108px);

  &::-webkit-scrollbar {
    display: none;
  }

  &::-webkit-scrollbar-thumb {
    background: ${colors.Gray2};
    border-radius: 10px;
  }

  &:hover::-webkit-scrollbar {
    display: block;
    width: 15px;
  }
`;

export { ChatContainer, Chats };
