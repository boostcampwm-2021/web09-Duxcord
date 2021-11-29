import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { setSelectedGroup } from '@redux/selectedGroup/slice';
import { useGroups, useToast } from '@hooks/index';
import Colors from '@styles/Colors';
import { URL } from '@utils/constants/URL';
import { postCreateGroup } from '@api/postCreateGroup';
import { uploadFileWithPresignedUrl } from '@utils/uploadFile';
import getPresignedUrl from '@utils/getPresignedUrl';
import { TOAST_MESSAGE } from '@utils/constants/MESSAGE';
import { GroupThumbnailUploadIcon } from '@components/common/Icons';
import Modal from '..';
import { InputForm, InputImage, InputText } from './style';
import { resetSelectedChannel } from '@redux/selectedChannel/slice';

function GroupCreateModal({
  controller: { hide, show, previous },
}: {
  controller: ModalController;
}) {
  const [groupName, setGroupName] = useState('');
  const { groups, mutate } = useGroups();
  const dispatch = useDispatch();
  const history = useHistory();
  const updateGroupName = (newGroupName: string) => {
    setGroupName(newGroupName);
  };
  const finishModal = () => {
    setGroupName('');
    hide();
  };
  const { fireToast } = useToast();

  const createGroup = async () => {
    if (groupName === '') return;
    const response = await postCreateGroup({
      groupName: groupName,
      groupThumbnail: fileURL,
    });
    switch (response.status) {
      case 200:
        const group = await response.json();
        mutate([...groups, group], false);
        dispatch(resetSelectedChannel());
        dispatch(setSelectedGroup(group));
        finishModal();
        history.replace(URL.GROUP(group.id));
        fireToast({ message: '그룹 생성에 성공하셨습니다', type: 'success' });
        break;
      case 400:
        const responseText = await response.text();
        fireToast({ message: responseText, type: 'warning' });
        break;
      default:
        fireToast({ message: TOAST_MESSAGE.ERROR.GROUP_CREATE, type: 'warning' });
    }
  };

  const [fileURL, setFileURL] = useState<string | null>(null);

  const inputImage = useRef<HTMLDivElement>(null);
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
        inputImage.current.style.backgroundImage = `url('${uploadedURL}')`;
        setFileURL(uploadedURL);
        fireToast({ message: TOAST_MESSAGE.SUCCESS.FILE_UPLOAD, type: 'success' });
      } else fireToast({ message: TOAST_MESSAGE.ERROR.FILE_UPLOAD, type: 'warning' });
    } catch (error) {
      fireToast({ message: TOAST_MESSAGE.ERROR.COMMON, type: 'warning' });
    }
  };
  const InputFormComponent = (
    <InputForm onSubmit={createGroup}>
      <InputImage ref={inputImage}>
        <input
          type="file"
          id="group_thumbnail"
          onChange={uploadFile}
          style={{ width: 100, height: 100, opacity: 0 }}
          accept="image/jpeg, image/png"
        />
        {!fileURL && <GroupThumbnailUploadIcon />}
      </InputImage>
      <InputText
        type="text"
        id="group_name"
        value={groupName}
        onChange={(e) => updateGroupName(e.target.value)}
        placeholder="그룹 이름을 입력해주세요"
      />
    </InputForm>
  );

  return (
    <Modal
      props={{
        title: '그룹 만들기',
        subTitle: '',
        middleContent: InputFormComponent,
        bottomRightButton: {
          text: '만들기',
          color: Colors.Blue,
          onClickHandler: () => {
            createGroup();
          },
        },
      }}
      controller={{ hide: finishModal, show, previous }}
    />
  );
}

export default GroupCreateModal;
