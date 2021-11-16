import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import Modal from '..';
import { postCreateGroup } from '../../../api/postCreateGroup';
import { useGroups } from '@hooks/index';
import { setSelectedGroup } from '@redux/selectedGroup/slice';
import Colors from '@styles/Colors';
import { ModalController } from '@customTypes/modal';
import { InputForm, InputImage, InputText } from './style';
import { URL } from 'src/api/URL';
import { uploadFileToStorage } from 'src/utils/uploadFile';
import { GroupThumbnailUploadIcon } from '../../common/Icons';

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
        dispatch(setSelectedGroup(group));
        finishModal();
        history.push(URL.groupPage(group.id));
        break;
      case 400:
        const responseText = await response.text();
        console.error(responseText);
        break;
      default:
        console.log('백엔드가 포기한 요청');
    }
  };

  const [fileURL, setFileURL] = useState<string | null>(null);

  const inputImage = useRef<HTMLDivElement>(null);
  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (!target.files) return;
    const file: File = (target.files as FileList)[0];
    if (!file.type.match('image/jpeg|image/png')) return;
    const uploadedFile = await uploadFileToStorage(file);
    if (uploadedFile && inputImage && inputImage.current) {
      inputImage.current.style.backgroundImage = `url('${uploadedFile}')`;
      setFileURL(uploadedFile);
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
