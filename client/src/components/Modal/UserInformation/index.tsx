import React, { useEffect } from 'react';
import { ModalController } from '@customTypes/modal';
import Modal from '..';
import { useSelectedUser, useOtherUserData } from '@hooks/index';
import { useDispatch } from 'react-redux';
import { setSelectedUser } from '@redux/selectedUser/slice';
import { UserDot, UserImageWrapper, UserImage, UserGridWrapper, UserName, UserBio } from './style';
import Colors from '@styles/Colors';

export default function UserInformationModal({ controller }: { controller: ModalController }) {
  const selectedUser = useSelectedUser();
  const { otherUserData } = useOtherUserData(selectedUser.id);
  const dispatch = useDispatch();

  useEffect(() => {
    if (otherUserData === undefined) return;
    dispatch(
      setSelectedUser({
        ...selectedUser,
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
            src={selectedUser.thumbnail ?? '/images/default_profile.png'}
            alt="user profile"
          />
          {selectedUser.isOnline !== null && <UserDot isOnline={selectedUser.isOnline} />}
        </UserImageWrapper>
        <UserName>
          {selectedUser.username}({selectedUser.loginID})
        </UserName>
      </UserGridWrapper>
      <UserBio>{selectedUser.bio ?? '소개가 비어있습니다.'}</UserBio>
    </>
  );

  const UserEditButton = selectedUser.isEditable
    ? {
        text: '정보 수정하기',
        onClickHandler: controller.next,
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
