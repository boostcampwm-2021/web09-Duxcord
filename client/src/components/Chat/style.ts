import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

interface IChatWrapper {
  isSelectedChat: boolean;
}

const ChatWrapper = styled.div<IChatWrapper>`
  ${(props) => (props.isSelectedChat ? `width: 70%;` : `width: calc(100% - 300px);`)}
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ChatInputWrapper = styled.div`
  width: 100%;
`;

export { ChatWrapper, Wrapper, ChatInputWrapper };
