import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { setSelectedUser } from '@redux/selectedUser/slice';
import { useUserdata, useSelectedUser } from '@hooks/index';
import { ModalController } from '@customTypes/modal';
import Colors from '@styles/Colors';
import { patchUserdata } from 'src/api/patchUserdata';
import { uploadFileToStorage } from 'src/utils/uploadFile';
import Modal from '..';
import {
  UserImageWrapper,
  UserGridWrapper,
  UserName,
  UserBio,
  ErrorDiv,
  InputImage,
} from './style';

export default function UserEditModal({ controller }: { controller: ModalController }) {
  const { userdata, mutate: mutateUserdata } = useUserdata();
  const selectedUser = useSelectedUser();
  const [newUserName, setNewUserName] = useState(userdata.username);
  const [newBio, setNewBio] = useState(userdata.bio ?? '');

  const [thumbnail, setThumbnail] = useState<string | null>(userdata.thumbnail);
  const [fileError, setFileError] = useState(false);
  const inputImage = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!inputImage.current) return;
    if (!thumbnail) inputImage.current.style.backgroundImage = `url('/images/default_profile.png')`;
    else inputImage.current.style.backgroundImage = `url('${thumbnail}')`;
  }, [thumbnail]);

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const target = e.target as HTMLInputElement;
      if (!target.files) return;
      const file: File = (target.files as FileList)[0];
      if (!file.type.match('image/jpeg|image/png')) return;
      const uploadedFile = await uploadFileToStorage(file);
      if (uploadedFile && inputImage && inputImage.current) {
        setThumbnail(uploadedFile);
        setFileError(false);
      } else setFileError(true);
    } catch (error) {
      setFileError(true);
    }
  };

  const editProfile = async () => {
    await patchUserdata({ username: newUserName, bio: newBio, thumbnail: thumbnail });
    mutateUserdata({ ...userdata, username: newUserName, bio: newBio, thumbnail: thumbnail });
    dispatch(
      setSelectedUser({
        ...selectedUser,
        username: newUserName,
        bio: newBio,
        thumbnail: thumbnail,
      }),
    );
    controller.hide();
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
        <div>({userdata.loginID})</div>
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

  const UserEditButton = {
    text: '정보 저장하기',
    onClickHandler: editProfile,
    color: Colors.Blue,
  };

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
