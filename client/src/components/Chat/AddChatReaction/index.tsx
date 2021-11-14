import React from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedChat } from '../../../redux/selectedChat/slice';
import { ChatData } from '../../../types/chats';
import { LikeIcon, ThreadOpenIcon } from '../../common/Icon';
import { Wrapper } from './style';

function AddChatReaction({ handleLike, chatData }: { handleLike: () => {}; chatData: ChatData }) {
  const dispatch = useDispatch();
  return (
    <Wrapper>
      <LikeIcon onClick={handleLike} />
      <ThreadOpenIcon onClick={() => dispatch(setSelectedChat(chatData))} />
    </Wrapper>
  );
}

export default AddChatReaction;
