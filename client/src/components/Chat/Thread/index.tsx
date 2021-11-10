import React from 'react';
import { useDispatch } from 'react-redux';
import useSWR from 'swr';
import { API_URL } from '../../../api/API_URL';
import { useSelectedChannel } from '../../../hooks/useSelectedChannel';
import { setSelectedChat } from '../../../redux/selectedChat/slice';
import { ChatData } from '../../../types/chats';
import { getFetcher } from '../../../util/fetcher';
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

function Thread({ selectedChat }: { selectedChat: ChatData }) {
  const { data } = useSWR(API_URL.thread.getThread(selectedChat.id), getFetcher);
  const dispatch = useDispatch();
  const { name } = useSelectedChannel();
  const {
    createdAt,
    content,
    user: { username, thumbnail },
  } = selectedChat;
  console.log(data);
  return (
    <ThreadWrapper>
      <div>
        <ThreadHeaderWrapper>
          <div>
            <div>Thread</div>
            <div>#{name}</div>
          </div>
          <img
            src="/icons/threadClose.png"
            alt="close thread"
            onClick={() => dispatch(setSelectedChat(0))}
          />
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
        <ThreadChatWrapper>
          {data && data.map((v: ChatData) => <ThreadItem threadData={v} />)}
        </ThreadChatWrapper>
      </div>
      <Wrapper>
        <ButtonWrapper>
          <img src="/icons/btn-text-add-file.svg" alt="add file button" />
        </ButtonWrapper>
        <Input placeholder="Message to channel" />
      </Wrapper>
    </ThreadWrapper>
  );
}

export default Thread;
