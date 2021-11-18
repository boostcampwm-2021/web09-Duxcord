import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import Modal from '..';
import { postCreateGroup } from '../../../api/postCreateGroup';
import { useGroups } from '@hooks/index';
import { setSelectedGroup } from '@redux/selectedGroup/slice';
import Colors from '@styles/Colors';
import { ModalController } from '@customTypes/modal';
import { ErrorDiv, InputForm, InputImage, InputText } from './style';
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

  const [postError, setPostError] = useState<string | null>(null);
  const createGroup = async () => {
    if (groupName === '') return;
    const response = await postCreateGroup({
      groupName: groupName,
      groupThumbnail: fileURL,
    });
    switch (response.status) {
      case 200:
        setPostError(null);
        const group = await response.json();
        mutate([...groups, group], false);
        dispatch(setSelectedGroup(group));
        finishModal();
        history.replace(URL.groupPage(group.id));
        break;
      case 400:
        const responseText = await response.text();
        setPostError(responseText);
        break;
      default:
        setPostError('그룹 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const [fileURL, setFileURL] = useState<string | null>(null);
  const [fileError, setFileError] = useState(false);

  const inputImage = useRef<HTMLDivElement>(null);
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
      {fileError && (
        <ErrorDiv>사진을 성공적으로 업로드하지 못했습니다. 다시 시도해주세요.</ErrorDiv>
      )}
      <InputText
        type="text"
        id="group_name"
        value={groupName}
        onChange={(e) => updateGroupName(e.target.value)}
        placeholder="그룹 이름을 입력해주세요"
      />
      {postError && <ErrorDiv>{postError}</ErrorDiv>}
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
