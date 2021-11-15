import React, { useState } from 'react';
import { useUserdata, useSelectedGroup } from '@hooks/index';
import { ModalController } from '@customTypes/modal';
import { GroupDeleteIcon, GroupInviteIcon } from '../../common/Icon';
import GroupInviteModal from '../../Modal/GroupInvite';
import { GroupSettingWrapper } from './style';

function GroupSetting() {
  const selectedGroup = useSelectedGroup();
  const { userdata } = useUserdata();
  const isLeader = selectedGroup?.leader.loginID === userdata?.loginID;

  const [showModal, setShowModal] = useState(false);
  const modalController: ModalController = {
    hide: () => setShowModal(false),
    show: () => setShowModal(true),
  };

  return (
    <GroupSettingWrapper>
      <p>{selectedGroup?.name}</p>
      {selectedGroup && (
        <div>
          <GroupInviteIcon onClick={modalController.show} />
          {isLeader && <GroupDeleteIcon width="24px" height="24px" />}
        </div>
      )}
      {showModal && <GroupInviteModal controller={modalController} />}
    </GroupSettingWrapper>
  );
}

export default GroupSetting;
