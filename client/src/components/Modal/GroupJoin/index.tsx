import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import Modal from '..';
import { useGroups } from '../../../hooks/useGroups';
import { setSelectedGroup } from '../../../redux/selectedGroup/slice';
import colors from '../../../styles/colors';
import { Input } from './style';

function GroupJoinModal({ controller }: { controller: any }) {
  const { hidden, setHidden } = controller;
  const [groupCode, setGroupCode] = useState('');
  const { groups, mutate } = useGroups();
  const dispatch = useDispatch();
  const history = useHistory();
  const updateGroupCode = (newGroupCode: string) => {
    setGroupCode(newGroupCode);
  };

  const joinGroup = async () => {
    const response = await fetch('http://localhost:8000/api/group/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        groupCode: groupCode,
      }),
    });
    switch (response.status) {
      case 200:
        const responseJSON = await response.json();
        const { group } = responseJSON;
        mutate([...groups, group], false);
        dispatch(setSelectedGroup(group));
        history.push(`/Main/group/${group.id}`);
        setHidden(true);
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
          title: '그룹 참가하기',
          color: colors.Blue,
          onClickHandler: joinGroup,
        },
      }}
      controller={{ hidden, setHidden }}
    />
  );
}

export default GroupJoinModal;
