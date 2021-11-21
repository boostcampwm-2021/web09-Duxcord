import React, { useState } from 'react';

import { useUserdata, useSelectedGroup } from '@hooks/index';
import { ModalController } from '@customTypes/modal';
import { GroupDeleteIcon, GroupInviteIcon } from '@components/common/Icons';
import GroupInviteModal from '@components/Modal/GroupInvite';
import GroupDeleteModal from '@components/Modal/GroupDelete';
import { GroupSettingWrapper } from './style';

function GroupSetting() {
  const selectedGroup = useSelectedGroup();
  const { userdata } = useUserdata();
  const [selectedModal, setSelectedModal] = useState('');
  const isLeader = selectedGroup?.leader?.loginID === userdata?.loginID;

  const groupInviteModalControl: ModalController = {
    hide: () => setSelectedModal(''),
    show: () => setSelectedModal('INVITE'),
  };
  const groupDeleteModalControl: ModalController = {
    hide: () => setSelectedModal(''),
    show: () => setSelectedModal('DELETE'),
  };

  return (
    <GroupSettingWrapper>
      <p>{selectedGroup?.name}</p>
      {selectedGroup && selectedGroup.name && (
        <div>
          <GroupInviteIcon onClick={groupInviteModalControl.show} />
          {isLeader && (
            <GroupDeleteIcon width="24px" height="24px" onClick={groupDeleteModalControl.show} />
          )}
        </div>
      )}
      {selectedModal === 'INVITE' ? (
        <GroupInviteModal controller={groupInviteModalControl} />
      ) : selectedModal === 'DELETE' ? (
        <GroupDeleteModal controller={groupDeleteModalControl} />
      ) : null}
    </GroupSettingWrapper>
  );
}

export default GroupSetting;
