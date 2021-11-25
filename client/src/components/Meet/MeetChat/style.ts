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
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${Colors.Gray2};
    border-radius: 10px;
  }
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  & div:first-child {
    font-weight: bold;
    font-size: 15px;
    margin: 0 3px;
  }
  & div:last-child {
    color: ${Colors.Gray1};
    font-size: 12px;
  }
`;

interface IChat {
  isSender: boolean;
}

const Chat = styled.li<IChat>`
  margin-top: 5px;
  ${(props) => props.isSender && `text-align: right;`}
  & div {
    display: flex;
    ${(props) => props.isSender && `flex-direction: row-reverse;`}
    & img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: ${Colors.Gray2};
      ${(props) => (props.isSender ? `margin-right: 3px;` : `margin-left: 3px;`)}
    }
  }
  & span {
    ${(props) => (props.isSender ? `margin-right: 30px;` : `margin-left: 30px;`)}
  }
`;

const Message = styled.span`
  display: inline-block;
  padding: 12px;
  background-color: ${Colors.Gray3};
  border-radius: 15px;
  overflow-wrap: break-word;
  word-break: break-all;
`;

const ShowChatButton = styled.button`
  cursor: pointer;
  position: absolute;
  left: 10px;
  top: 10px;
  background: none;
  border: none;
  z-index: 10;

  svg {
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

  svg {
    width: 20px;
    height: 20px;
  }
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

const NewMessageIndicator = styled.div`
  position: absolute;
  top: -3px;
  right: 0;
  background-color: ${Colors.Red};
  width: 10px;
  height: 10px;
  border-radius: 50%;
`;

export {
  ChatWrap,
  ChatList,
  ChatHeader,
  ShowChatButton,
  CloseChatButton,
  Message,
  Chat,
  Input,
  InputWrap,
  NewMessageIndicator,
};
