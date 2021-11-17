import React, { useEffect } from 'react';
import { ModalController } from '@customTypes/modal';
import Modal from '..';
import { useSelectedOtherUser, useOtherUserData } from '@hooks/index';
import { useDispatch } from 'react-redux';
import { setSelectedOtherUser } from '@redux/selectedOtherUser/slice';
import { UserDot, UserImageWrapper, UserImage, UserGridWrapper, UserName, UserBio } from './style';
import Colors from '@styles/Colors';

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

  const UserEditButton = selectedOtherUser.isEditable
    ? {
        text: '정보 수정하기',
        onClickHandler: () => {},
        color: Colors.Blue,
      }
    : null;

  return (
    <Modal
      props={{
        middleContent: UserInformation,
        bottomRightButton: UserEditButton,
      }}
      controller={controller}
    />
  );
}
