import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import Modal from '..';
import { postCreateGroup } from '../../../api/postCreateGroup';
import { useGroups } from '@hooks/useGroups';
import { setSelectedGroup } from '@redux/selectedGroup/slice';
import Colors from '@styles/Colors';
import { ModalController } from '@customTypes/modal';
import { InputForm, InputImage, InputText } from './style';

function GroupCreateModal({ controller: { hide, show } }: { controller: ModalController }) {
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
    const response = await postCreateGroup({ groupName: groupName });
    switch (response.status) {
      case 200:
        const group = await response.json();
        mutate([...groups, group], false);
        dispatch(setSelectedGroup(group));
        finishModal();
        history.push(`/main/group/${group.id}`);
        break;
      case 400:
        const responseText = await response.text();
        console.error(responseText);
        break;
      default:
        console.log('백엔드가 포기한 요청');
    }
  };

  const InputFormComponent = (
    <InputForm onSubmit={createGroup}>
      <InputImage>
        <input type="file" id="group_thumbnail" style={{ width: 100, height: 100, opacity: 0 }} />
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
      controller={{ hide: finishModal, show }}
    />
  );
}

export default GroupCreateModal;
