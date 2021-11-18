import React, { FormEvent, useEffect, useLayoutEffect, useRef, useState } from 'react';
import MeetEvent from '@customTypes/socket/MeetEvent';
import { useSelectedChannel, useUserdata } from '@hooks/index';
import { socket } from '../../../utils/socket';
import { ChatCloseIcon, ChatOpenIcon } from '../../common/Icons';
import {
  Chat,
  ChatList,
  ChatHeader,
  ChatWrap,
  CloseChatButton,
  Input,
  InputWrap,
  Message,
  ShowChatButton,
} from './style';

interface IChat {
  id: number;
  loginID: string;
  username: string;
  thumbnail: string;
  message: string;
  createdAt: string;
}

const THRESHOLD = 300;

function MeetChat() {
  const { userdata } = useUserdata();
  const { id: channelID } = useSelectedChannel();
  const [chats, setChats] = useState<IChat[]>([]);
  const chatListRef = useRef<HTMLUListElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const [show, setShow] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!chatInputRef.current || !userdata) return;
    const message = chatInputRef.current.value;
    if (message.trim() === '') return;
    socket.emit(MeetEvent.meetChat, {
      channelID,
      chat: { ...userdata, message, createdAt: new Date().toLocaleTimeString('ko-KR') },
    });
    chatInputRef.current.value = '';
  };

  const scrollToBottom = () => {
    if (!chatListRef.current) return;
    chatListRef.current.scrollTo({ top: chatListRef.current.scrollHeight, behavior: 'smooth' });
  };

  useLayoutEffect(() => {
    scrollToBottom();
  }, [show]);

  useEffect(() => {
    socket.on(MeetEvent.meetChat, (chat: IChat) => {
      setChats((chats) => [...chats, chat]);
      if (!chatListRef.current) return;
      const { scrollTop, clientHeight, scrollHeight } = chatListRef.current;
      if (scrollHeight - (scrollTop + clientHeight) < THRESHOLD) scrollToBottom();
    });

    return () => {
      socket.off(MeetEvent.meetChat);
    };
  }, []);

  return show ? (
    <ChatWrap>
      <CloseChatButton>
        <ChatCloseIcon onClick={() => setShow(false)} />
      </CloseChatButton>
      <ChatList ref={chatListRef}>
        {chats.map(({ id, loginID, username, thumbnail, message, createdAt }) => (
          <Chat key={id}>
            <div>
              <img src={thumbnail ?? '/images/default_profile.png'} alt="user profile" />
              <ChatHeader>
                <div>{`${username}(${loginID})`}</div>
                <div>{createdAt}</div>
              </ChatHeader>
            </div>
            <Message>{message}</Message>
          </Chat>
        ))}
      </ChatList>
      <InputWrap onSubmit={onSubmit}>
        <Input ref={chatInputRef} type="text" />
      </InputWrap>
    </ChatWrap>
  ) : (
    <ShowChatButton onClick={() => setShow(true)}>
      <ChatOpenIcon />
    </ShowChatButton>
  );
}

export default MeetChat;
