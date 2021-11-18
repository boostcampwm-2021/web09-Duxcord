import React, { useState } from 'react';
import { ModalController } from '@customTypes/modal';
import Modal from '..';
import { useSelectedUser } from '@hooks/index';
import { UserImageWrapper, UserImage, UserGridWrapper, UserName, UserBio } from './style';
import Colors from '@styles/Colors';

export default function UserEditModal({ controller }: { controller: ModalController }) {
  const selectedUser = useSelectedUser();
  const [newUserName, setNewUserName] = useState(selectedUser.username);
  const [newBio, setNewBio] = useState(selectedUser.bio ?? '');

  const UserEditForm = (
    <>
      <UserGridWrapper>
        <UserImageWrapper>
          <UserImage
            src={selectedUser.thumbnail ?? '/images/default_profile.png'}
            alt="user profile"
            type="file"
          />
        </UserImageWrapper>
        <UserName
          type="text"
          value={newUserName}
          onChange={(e) => {
            setNewUserName(e.target.value);
          }}
        />
        <div>({selectedUser.loginID})</div>
      </UserGridWrapper>
      <UserBio
        onChange={(e) => {
          setNewBio(e.target.value);
        }}
      >
        {newBio}
      </UserBio>
    </>
  );

  const UserEditButton = selectedUser.isEditable
    ? {
        text: '정보 저장하기',
        onClickHandler: () => {},
        color: Colors.Blue,
      }
    : null;

  return (
    <Modal
      props={{
        middleContent: UserEditForm,
        bottomRightButton: UserEditButton,
      }}
      controller={controller}
    />
  );
}
