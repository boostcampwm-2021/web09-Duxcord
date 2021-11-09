import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import Modal from '..';
import { postJoinGroup } from '../../../api/postJoinGroup';
import { useGroups } from '../../../hooks/useGroups';
import { setSelectedGroup } from '../../../redux/selectedGroup/slice';
import Colors from '../../../styles/Colors';
import { ModalController } from '../../../types/modal';
import { Input } from './style';

function GroupJoinModal({ controller: { hide, show } }: { controller: ModalController }) {
  const [groupCode, setGroupCode] = useState('');
  const { groups, mutate } = useGroups();
  const dispatch = useDispatch();
  const history = useHistory();
  const updateGroupCode = (newGroupCode: string) => {
    setGroupCode(newGroupCode);
  };

  const finishModal = () => {
    setGroupCode('');
    hide();
  };

  const joinGroup = async () => {
    const response = await postJoinGroup({ groupCode: groupCode });
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
        console.log(responseText);
        break;
      default:
        console.log('백엔드가 포기한 요청..');
    }
  };

  const InputComponent = (
    <Input
      onChange={(e) => updateGroupCode(e.target.value)}
      placeholder="그룹 코드를 입력해주세요"
      value={groupCode}
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
          color: Colors.Blue,
          onClickHandler: joinGroup,
        },
      }}
      controller={{ hide: finishModal, show }}
    />
  );
}

export default GroupJoinModal;
