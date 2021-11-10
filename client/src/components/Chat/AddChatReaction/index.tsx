import React from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedChat } from '../../../redux/selectedChat/slice';
import { ChatData } from '../../../types/chats';
import { Wrapper } from './style';

function AddChatReaction({ handleLike, chatData }: { handleLike: () => {}; chatData: ChatData }) {
  const dispatch = useDispatch();
  return (
    <Wrapper>
      <img src="/icons/btn-like.svg" alt="btn like" onClick={handleLike} />
      <img
        src="/icons/btn-thread.svg"
        alt="btn thread"
        onClick={() => dispatch(setSelectedChat(chatData))}
      />
    </Wrapper>
  );
}

export default AddChatReaction;
