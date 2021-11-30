import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { useGroups, useToast } from '@hooks/index';
import { setSelectedGroup } from '@redux/selectedGroup/slice';
import { resetSelectedChannel } from '@redux/selectedChannel/slice';
import { TOAST_MESSAGE, URL } from '@constants/index';
import { postJoinGroup } from '@api/index';
import Colors from '@styles/Colors';
import Modal from '..';
import { Input } from './style';

function GroupJoinModal({ controller: { hide, show, previous } }: { controller: ModalController }) {
  const [groupCode, setGroupCode] = useState('');
  const { groups, mutate } = useGroups();
  const dispatch = useDispatch();
  const history = useHistory();
  const { fireToast } = useToast();
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
        dispatch(resetSelectedChannel());
        dispatch(setSelectedGroup(group));
        finishModal();
        history.replace(URL.GROUP(group.id));
        fireToast({ message: TOAST_MESSAGE.SUCCESS.GROUP_INVITATION, type: 'success' });
        break;
      case 400:
        const responseText = await response.text();
        fireToast({ message: responseText, type: 'warning' });
        break;
      default:
        fireToast({ message: TOAST_MESSAGE.ERROR.GROUP_INVITATION, type: 'warning' });
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
      controller={{ hide: finishModal, show, previous }}
    />
  );
}

export default GroupJoinModal;
