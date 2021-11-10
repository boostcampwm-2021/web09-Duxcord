import styled from 'styled-components';
import Colors from '../../../styles/Colors';

const ChatWrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  background-color: ${Colors.White};
  padding: 10px;
`;

const ChatList = styled.ul`
  overflow-y: scroll;
  width: 300px;
  height: calc(100% - 52px);

  &::-webkit-scrollbar {
    display: none;
  }

  &::-webkit-scrollbar-thumb {
    background: ${Colors.Gray2};
    border-radius: 10px;
  }

  &:hover::-webkit-scrollbar {
    display: block;
    width: 10px;
  }
`;

const ShowChatButton = styled.button`
  cursor: pointer;
  position: absolute;
  left: 10px;
  top: 10px;
  background: none;
  border: none;

  img {
    width: 25px;
    height: 25px;
  }
`;

const CloseChatButton = styled.button`
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 10px;
  background: none;
  border: none;

  img {
    width: 20px;
    height: 20px;
  }
`;

const Chat = styled.li`
  margin-top: 5px;
`;

const Message = styled.span`
  display: inline-block;
  padding: 12px;
  background-color: ${Colors.Gray3};
  border-radius: 15px;
  overflow-wrap: break-word;
`;

const InputWrap = styled.form`
  width: 100%;
`;

const Input = styled.input`
  background-color: ${Colors.Gray3};
  padding: 10px;
  width: 100%;
  height: 30px;
  outline: none;
  border: none;
  border-radius: 5px;
`;

export { ChatWrap, ChatList, ShowChatButton, CloseChatButton, Message, Chat, Input, InputWrap };
