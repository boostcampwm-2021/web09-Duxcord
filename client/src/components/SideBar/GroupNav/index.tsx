import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { useGroups } from '../../../hooks/useGroups';
import { useSelectedChannel } from '../../../hooks/useSelectedChannel';
import { setSelectedChannel } from '../../../redux/selectedChannel/slice';
import { setSelectedGroup } from '../../../redux/selectedGroup/slice';
import GroupJoinModal from '../../Modal/GroupJoin';
import { GroupListWrapper, GroupList, Group, GroupListDivider, AddGroupButton } from './style';
import { socket } from '../../../util/socket';
import { ModalController } from '../../../types/modal';

function GroupNav() {
  const { groups } = useGroups();
  const { id, type } = useSelectedChannel();
  const dispatch = useDispatch();
  const history = useHistory();

  const [modalHidden, setModalHidden] = useState(true);
  const modalController: ModalController = {
    hidden: modalHidden,
    hide: () => setModalHidden(true),
    show: () => setModalHidden(false),
  };

  const selectGroup = (group: any) => () => {
    history.push(`/Main/group/${group.id}`);
    socket.emit('leaveChannel', type + id);
    dispatch(setSelectedChannel({ type: '', id: null, name: '' }));
    dispatch(setSelectedGroup(group));
    // group.id의 키에 있는 애들 다 알려줘~!
    socket.emit('GroupID', group.code);
  };

  const openGroupJoinModal = () => {
    setModalHidden(false);
  };

  useEffect(() => {
    socket.on('GroupUserConnection', (connectionList) => {
      console.log('그룹 클릭!', connectionList);
    });

    socket.on('userExit', (user, code) => {
      console.log(user, code, '유저가 나갔습니다.');
    });

    socket.on('userEnter', (user, code) => {
      console.log(user, code, '유저가 들어왔습니다.');
    });

    return () => {
      socket.off('GroupUserConnection');
      socket.off('userExit');
      socket.off('userEnter');
    };
  }, []);

  return (
    <GroupListWrapper>
      <GroupList>
        {groups?.map((group: any) => (
          <Group key={group.id} onClick={selectGroup(group)}>
            {group.name}
          </Group>
        ))}
      </GroupList>
      <GroupListDivider />
      <div>
        <AddGroupButton onClick={openGroupJoinModal}>
          <img src="/icons/addGroup.png" alt="addGroup" />
        </AddGroupButton>
      </div>
      <GroupJoinModal controller={modalController} />
    </GroupListWrapper>
  );
}

export default GroupNav;
