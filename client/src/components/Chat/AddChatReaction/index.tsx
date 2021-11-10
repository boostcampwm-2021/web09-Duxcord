import React from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedChat } from '../../../redux/selectedChat/slice';
import { Wrapper } from './style';

function AddChatReaction({ handleLike, chatID }: { handleLike: () => {}; chatID: number }) {
  const dispatch = useDispatch();
  return (
    <Wrapper>
      <img src="/icons/btn-like.svg" alt="btn like" onClick={handleLike} />
      <img
        src="/icons/btn-thread.svg"
        alt="btn thread"
        onClick={() => dispatch(setSelectedChat(chatID))}
      />
    </Wrapper>
  );
}

export default AddChatReaction;
