import React, { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import useSWR from 'swr';
import { API_URL } from '../../../api/API_URL';
import { postCreateThread } from '../../../api/postCreateThread';
import { useSelectedChannel } from '@hooks/useSelectedChannel';
import { setSelectedChat } from '@redux/selectedChat/slice';
import { ChatData } from '@customTypes/chats';
import { getFetcher } from '../../../util/fetcher';
import { socket } from '../../../util/socket';
import ChannelEvent from '@customTypes/socket/ChannelEvent';
import { FileSelectIcon, ThreadCloseIcon } from '../../common/Icon';
import ThreadItem from '../ThreadItem';
import {
  ButtonWrapper,
  Input,
  Wrapper,
  ThreadWrapper,
  ThreadHeaderWrapper,
  OriginalChatWrapper,
  ThreadChatWrapper,
  ChatLengthWrapper,
} from './style';
import ThreadType from '@customTypes/socket/ThreadEvent';

function Thread({ selectedChat }: { selectedChat: ChatData }) {
  const { mutate, data } = useSWR(API_URL.thread.getThread(selectedChat.id), getFetcher);
  const dispatch = useDispatch();
  const { name } = useSelectedChannel();
  const {
    createdAt,
    content,
    user: { username, thumbnail },
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
    socket.emit(ChannelEvent.joinChannel, ThreadType.thread + selectedChat.id);
    return () => {
      socket.emit(ChannelEvent.leaveChannel, ThreadType.thread + selectedChat.id);
    };
  }, [selectedChat.id]);

  useEffect(() => {
    socket.on(ThreadType.threadUpdate, onThread);
    return () => {
      socket.off(ThreadType.threadUpdate);
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
    <ThreadWrapper>
      <div>
        <ThreadHeaderWrapper>
          <div>
            <div>Thread</div>
            <div>#{name}</div>
          </div>
          <ThreadCloseIcon onClick={() => dispatch(setSelectedChat(0))} />
        </ThreadHeaderWrapper>
        <OriginalChatWrapper>
          <img src={thumbnail ? thumbnail : '/images/default_profile.png'} alt="thumbnail" />
          <div>
            <div>
              <p>{username}</p>
              <p>{new Date(createdAt).toLocaleTimeString('ko-KR')}</p>
            </div>
            <div>{content}</div>
          </div>
        </OriginalChatWrapper>
        <ChatLengthWrapper>{data?.length}개의 댓글</ChatLengthWrapper>
        <ThreadChatWrapper ref={threadChatListRef}>
          {data && data.map((v: ChatData) => <ThreadItem key={v.id} threadData={v} />)}
        </ThreadChatWrapper>
      </div>
      <Wrapper onSubmit={createThread}>
        <ButtonWrapper>
          <FileSelectIcon />
        </ButtonWrapper>
        <Input
          placeholder="Message to channel"
          value={threadInput}
          onChange={(e) => setThreadInput(e.target.value)}
        />
      </Wrapper>
    </ThreadWrapper>
  );
}

export default Thread;
