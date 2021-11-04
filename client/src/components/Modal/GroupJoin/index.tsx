import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import Modal from '..';
import { postJoinGroup } from '../../../api/postChat';
import { useGroups } from '../../../hooks/useGroups';
import { setSelectedGroup } from '../../../redux/selectedGroup/slice';
import colors from '../../../styles/colors';
import { ModalController } from '../../../types/modal';
import { Input } from './style';

function GroupJoinModal({ controller }: { controller: ModalController }) {
  const { hide } = controller;
  const [groupCode, setGroupCode] = useState('');
  const { groups, mutate } = useGroups();
  const dispatch = useDispatch();
  const history = useHistory();
  const updateGroupCode = (newGroupCode: string) => {
    setGroupCode(newGroupCode);
  };

  const joinGroup = async () => {
    const response = await postJoinGroup({ groupCode: groupCode });
    switch (response.status) {
      case 200:
        const group = await response.json();
        mutate([...groups, group], false);
        dispatch(setSelectedGroup(group));
        history.push(`/Main/group/${group.id}`);
        hide();
        break;
      case 400:
        const responseText = await response.text();
        console.log(responseText);
        break;
      default:
        console.log('백엔드가 포기한 요청..');
    }
  };

  const InputComponent = (
    <Input
      onChange={(e) => updateGroupCode(e.target.value)}
      placeholder='그룹 코드를 입력해주세요'
    />
  );
  return (
    <Modal
      props={{
        title: '그룹 참가하기',
        subTitle: '아래에 초대 코드를 입력해 그룹에 참가하세요',
        middleContent: InputComponent,
        bottomRightButton: {
          text: '그룹 참가하기',
          color: colors.Blue,
          onClickHandler: joinGroup,
        },
      }}
      controller={controller}
    />
  );
}

export default GroupJoinModal;
