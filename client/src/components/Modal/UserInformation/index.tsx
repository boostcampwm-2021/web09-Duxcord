import React, { useEffect } from 'react';
import { ModalController } from '@customTypes/modal';
import Modal from '..';
import { useSelectedOtherUser, useOtherUserData } from '@hooks/index';
import { useDispatch } from 'react-redux';
import { setSelectedOtherUser } from '@redux/selectedOtherUser/slice';
import { UserDot, UserImageWrapper, UserImage, UserGridWrapper, UserName, UserBio } from './style';

export default function UserInformationModal({ controller }: { controller: ModalController }) {
  const selectedOtherUser = useSelectedOtherUser();
  const { otherUserData } = useOtherUserData(selectedOtherUser.id);
  const dispatch = useDispatch();

  useEffect(() => {
    if (otherUserData === undefined) return;
    dispatch(
      setSelectedOtherUser({
        ...selectedOtherUser,
        bio: otherUserData.bio,
        loginID: otherUserData.loginID,
      }),
    );
  }, [otherUserData]);

  const UserInformation = (
    <>
      <UserGridWrapper>
        <UserImageWrapper>
          <UserImage
            src={selectedOtherUser.thumbnail ?? '/images/default_profile.png'}
            alt="user profile"
          />
          <UserDot isOnline={selectedOtherUser.isOnline} />
        </UserImageWrapper>
        <UserName>
          {selectedOtherUser.username}({selectedOtherUser.loginID})
        </UserName>
      </UserGridWrapper>
      <UserBio>{selectedOtherUser.bio ?? '소개가 비어있습니다.'}</UserBio>
    </>
  );

  return <Modal props={{ middleContent: UserInformation }} controller={controller} />;
}
