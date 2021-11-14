import React, { FormEvent, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSelectedChannel } from '@hooks/useSelectedChannel';
import { useUserdata } from '@hooks/useUserdata';
import { socket } from '../../../util/socket';
import { ChatHeader, UserImage } from '../../Chat/ChatItem/style';
import {
  Chat,
  ChatList,
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

const MEET_CHAT = 'meetChat';
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
    socket.emit(MEET_CHAT, {
      channelID,
      chat: { ...userdata, message, createdAt: new Date().toLocaleTimeString('ko-KR') },
    });
    chatInputRef.current.value = '';
  };

  const scrollToBottom = () => {
    if (!chatListRef.current) return;
    chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
  };

  useLayoutEffect(() => {
    scrollToBottom();
  }, [show]);

  useEffect(() => {
    socket.on(MEET_CHAT, (chat: IChat) => {
      setChats((chats) => [...chats, chat]);
      if (!chatListRef.current) return;
      const { scrollTop, clientHeight, scrollHeight } = chatListRef.current;
      if (scrollHeight - (scrollTop + clientHeight) < THRESHOLD) scrollToBottom();
    });

    return () => {
      socket.off(MEET_CHAT);
    };
  }, []);

  return show ? (
    <ChatWrap>
      <CloseChatButton onClick={() => setShow(false)}>
        <img src="/icons/btn-close-meetchat.svg" alt="close chat icon" />
      </CloseChatButton>
      <ChatList ref={chatListRef}>
        {chats.map(({ id, loginID, username, thumbnail, message, createdAt }) => (
          <Chat key={id}>
            <UserImage src={thumbnail ?? '/images/default_profile.png'} alt="user profile" />
            <ChatHeader>
              <div>{`${username}(${loginID})`}</div>
              <div>{createdAt}</div>
            </ChatHeader>
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
      <img src="/icons/btn-show-meetchat.svg" alt="show chat icon" />
    </ShowChatButton>
  );
}

export default MeetChat;
