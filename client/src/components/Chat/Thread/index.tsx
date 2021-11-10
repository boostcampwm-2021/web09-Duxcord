import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import useSWR from 'swr';
import { useSelectedChannel } from '../../../hooks/useSelectedChannel';
import { setSelectedChat } from '../../../redux/selectedChat/slice';
import { ChatData } from '../../../types/chats';
import {
  ButtonWrapper,
  Input,
  Wrapper,
  ThreadWrapper,
  ThreadHeaderWrapper,
  OrginalChatWrapper,
  ThreadChatWrapper,
} from './style';

function Thread({ selectedChat }: { selectedChat: ChatData }) {
  const dispatch = useDispatch();
  const { name } = useSelectedChannel();
  const {
    createdAt,
    content,
    user: { username, thumbnail },
  } = selectedChat;
  console.log(selectedChat);
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
        <OrginalChatWrapper>
          <img src="/images/default_profile.png" alt="thumbnail" />
          <div>
            <div>
              <p>{username}</p>
              <p>{new Date(createdAt).toLocaleTimeString('ko-KR')}</p>
            </div>
            <div>{content}</div>
          </div>
        </OrginalChatWrapper>
        <ThreadChatWrapper></ThreadChatWrapper>
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
