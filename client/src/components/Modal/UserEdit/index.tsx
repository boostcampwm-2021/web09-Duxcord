import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { setSelectedUser } from '@redux/selectedUser/slice';
import { useUserdata, useSelectedUser, useToast } from '@hooks/index';
import { ModalController } from '@customTypes/modal';
import Colors from '@styles/Colors';
import { patchUserdata } from 'src/api/patchUserdata';
import { uploadFileWithPresignedUrl } from 'src/utils/uploadFile';
import getPresignedUrl from 'src/utils/getPresignedUrl';
import { TOAST_MESSAGE } from 'src/utils/message';
import Modal from '..';
import { UserImageWrapper, UserGridWrapper, UserName, UserBio, InputImage } from './style';

export default function UserEditModal({ controller }: { controller: ModalController }) {
  const { userdata, mutate: mutateUserdata } = useUserdata();
  const selectedUser = useSelectedUser();
  const [newUserName, setNewUserName] = useState(userdata.username);
  const [newBio, setNewBio] = useState(userdata.bio ?? '');

  const [thumbnail, setThumbnail] = useState<string | null>(userdata.thumbnail);
  const inputImage = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const { fireToast } = useToast();

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
      const uploadName = `${new Date().toLocaleString()}-${file.name}`;
      const presignedUrl = await getPresignedUrl(uploadName);
      const uploadedFile = await uploadFileWithPresignedUrl(presignedUrl.url, file);
      if (uploadedFile && inputImage && inputImage.current) {
        const uploadedURL = 'https://kr.object.ncloudstorage.com/duxcord/' + uploadName;
        setThumbnail(uploadedURL);
        fireToast({ message: TOAST_MESSAGE.SUCCESS.FILE_UPLOAD, type: 'success' });
      } else fireToast({ message: TOAST_MESSAGE.ERROR.FILE_UPLOAD, type: 'warning' });
    } catch (error) {
      fireToast({ message: TOAST_MESSAGE.ERROR.FILE_UPLOAD, type: 'warning' });
    }
  };

  const editProfile = async () => {
    try {
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
      fireToast({ message: TOAST_MESSAGE.SUCCESS.PROFILE_EDIT, type: 'success' });
    } catch (error) {
      fireToast({ message: TOAST_MESSAGE.ERROR.PROFILE_EDIT, type: 'warning' });
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
          </InputImage>
        </UserImageWrapper>
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
