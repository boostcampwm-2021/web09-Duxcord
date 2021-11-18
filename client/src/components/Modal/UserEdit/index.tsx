import React, { useRef, useState } from 'react';
import { ModalController } from '@customTypes/modal';
import Modal from '..';
import { useSelectedUser } from '@hooks/index';
import {
  UserImageWrapper,
  UserGridWrapper,
  UserName,
  UserBio,
  ErrorDiv,
  InputImage,
} from './style';
import Colors from '@styles/Colors';
import { uploadFileToStorage } from 'src/utils/uploadFile';

export default function UserEditModal({ controller }: { controller: ModalController }) {
  const selectedUser = useSelectedUser();
  const [newUserName, setNewUserName] = useState(selectedUser.username);
  const [newBio, setNewBio] = useState(selectedUser.bio ?? '');
  const inputImage = useRef<HTMLDivElement>(null);

  const [fileURL, setFileURL] = useState<string | null>(null);
  const [fileError, setFileError] = useState(false);

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const target = e.target as HTMLInputElement;
      if (!target.files) return;
      const file: File = (target.files as FileList)[0];
      if (!file.type.match('image/jpeg|image/png')) return;
      const uploadedFile = await uploadFileToStorage(file);
      if (uploadedFile && inputImage && inputImage.current) {
        inputImage.current.style.backgroundImage = `url('${uploadedFile}')`;
        setFileURL(uploadedFile);
        setFileError(false);
      } else setFileError(true);
    } catch (error) {
      setFileError(true);
    }
  };

  const UserEditForm = (
    <>
      <UserGridWrapper>
        <UserImageWrapper>
          <InputImage ref={inputImage}>
            <input
              type="file"
              id="group_thumbnail"
              style={{ width: 100, height: 100, opacity: 0 }}
              accept="image/jpeg, image/png"
              onChange={uploadFile}
            />
            {!fileURL && (
              <img
                src={selectedUser.thumbnail ?? '/images/default_profile.png'}
                alt="user thumbnail"
              />
            )}
          </InputImage>
        </UserImageWrapper>
        {fileError && (
          <ErrorDiv>사진을 성공적으로 업로드하지 못했습니다. 다시 시도해주세요.</ErrorDiv>
        )}
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
