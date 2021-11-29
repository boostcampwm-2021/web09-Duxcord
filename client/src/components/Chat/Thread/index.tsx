import React, { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import useSWR from 'swr';

import { resetSelectedChat } from '@redux/selectedChat/slice';
import { useSelectedChannel } from '@hooks/index';
import { ChatData } from '@customTypes/chats';
import { API_URL } from '@utils/constants/API_URL';
import { postCreateThread } from '@api/postCreateThread';
import { getFetcher } from '@utils/fetcher';
import { socket } from '@utils/socket';
import ThreadItem from '../ThreadItem';
import FileItem from '../FileItem';
import { ThreadCloseIcon } from '../../common/Icons';
import {
  Input,
  InputWrapper,
  Wrapper,
  FileWrapper,
  ThreadWrapper,
  ThreadHeaderWrapper,
  OriginalChatWrapper,
  ThreadChatWrapper,
  ChatLengthWrapper,
  ChatLength,
} from './style';
import { SOCKET } from '@utils/constants/SOCKET_EVENT';

function Thread({ selectedChat }: { selectedChat: ChatData }) {
  const { mutate, data } = useSWR(API_URL.THREAD.GET_DATA(selectedChat.id), getFetcher);
  const dispatch = useDispatch();
  const { name } = useSelectedChannel();
  const {
    createdAt,
    content,
    user: { username, thumbnail },
    files,
  } = selectedChat;
  const threadChatListRef = useRef<HTMLDivElement>(null);

  const onThread = useCallback(
    (info: any) => {
      mutate(
        (threads: any) => [
          ...threads,
          {
            id: info.id,
            createdAt: info.createdAt,
            content: info.content,
            user: info.threadWriter,
          },
        ],
        false,
      );
    },
    [mutate],
  );

  useEffect(() => {
    socket.emit(SOCKET.CHANNEL_EVENT.JOIN_CHANNEL, SOCKET.CHAT_EVENT.THREAD + selectedChat.id);
    return () => {
      socket.emit(SOCKET.CHANNEL_EVENT.LEAVE_CHANNEL, SOCKET.CHAT_EVENT.THREAD + selectedChat.id);
    };
  }, [selectedChat.id]);

  useEffect(() => {
    socket.on(SOCKET.CHAT_EVENT.THREAD_UPDATE, onThread);
    return () => {
      socket.off(SOCKET.CHAT_EVENT.THREAD_UPDATE);
    };
  }, [onThread]);

  const [threadInput, setThreadInput] = useState('');
  const createThread = (e: FormEvent) => {
    e.preventDefault();
    if (selectedChat.id === null) return;
    postCreateThread({ chatID: selectedChat.id, content: threadInput });
    setThreadInput('');
  };

  return (
    <Wrapper>
      <ThreadWrapper>
        <ThreadHeaderWrapper>
          <div>
            <div>Thread</div>
            <div>#{name}</div>
          </div>
          <ThreadCloseIcon onClick={() => dispatch(resetSelectedChat())} />
        </ThreadHeaderWrapper>
        <OriginalChatWrapper>
          <img src={thumbnail ? thumbnail : '/images/default_profile.png'} alt="thumbnail" />
          <div>
            <div>
              <p>{username}</p>
              <p>{new Date(createdAt).toLocaleTimeString('ko-KR').slice(0, -3)}</p>
            </div>
            <div>{content}</div>
            <FileWrapper>
              {files &&
                files.map(({ src }) => (
                  <FileItem key={src} src={src} alt="thread file" itemType="thread" />
                ))}
            </FileWrapper>
          </div>
        </OriginalChatWrapper>
        <ChatLengthWrapper>
          <ChatLength>{data?.length}개의 댓글</ChatLength>
        </ChatLengthWrapper>
        <ThreadChatWrapper ref={threadChatListRef}>
          {data && data.map((v: ChatData) => <ThreadItem key={v.id} threadData={v} />)}
        </ThreadChatWrapper>
      </ThreadWrapper>
      <InputWrapper onSubmit={createThread}>
        <Input
          placeholder="Message to thread"
          value={threadInput}
          onChange={(e) => setThreadInput(e.target.value)}
        />
      </InputWrapper>
    </Wrapper>
  );
}

export default Thread;
