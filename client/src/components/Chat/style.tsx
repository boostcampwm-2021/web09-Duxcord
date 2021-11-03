import styled from "styled-components";

const ChatContainer = styled.div`
  flex: 1;
`;

const Chats = styled.div`
  overflow-y: scroll;
  flex: 1;
  height: calc(100vh - 108px);
`;

export { ChatContainer, Chats };
