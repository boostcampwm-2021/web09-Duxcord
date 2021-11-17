import React, { useEffect } from 'react';
import { ModalController } from '@customTypes/modal';
import Modal from '..';
import { useSelectedOtherUser } from '@hooks/useSelectedOtherUser';
import { useOtherUserData } from '@hooks/useOtherUserdata';
import { useDispatch } from 'react-redux';
import { setSelectedOtherUser } from '@redux/selectedOtherUser/slice';

export default function UserInformationModal({ controller }: { controller: ModalController }) {
  const selectedOtherUser = useSelectedOtherUser();
  const { otherUserData } = useOtherUserData(selectedOtherUser.id);
  const dispatch = useDispatch();

  useEffect(() => {
    if (otherUserData === undefined) return;
    dispatch(setSelectedOtherUser({ ...selectedOtherUser, bio: otherUserData.bio }));
  }, [otherUserData]);

  const UserInformation = (
    <>
      <div>{selectedOtherUser.username}</div>
      <div>{selectedOtherUser.thumbnail}</div>
      <div>{selectedOtherUser.bio}</div>
      <div>{selectedOtherUser.isOnline}</div>
      <div>{selectedOtherUser.canEdit}</div>
    </>
  );

  return <Modal props={{ middleContent: UserInformation }} controller={controller} />;
}
