import React, { useState } from 'react';
import { useSelectedGroup } from '../../../hooks/useSelectedGroup';
import { ModalController } from '../../../types/modal';
import GroupInviteModal from '../../Modal/GroupInvite';
import { GroupSettingWrapper } from './style';

function GroupSetting() {
  const selectedGroup = useSelectedGroup();

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
          <img src="/icons/inviteGroup.png" alt="inviteGroup" onClick={modalController.show} />
          <img src="/icons/delete.png" alt="deleteGroup" />
        </div>
      )}
      {showModal && <GroupInviteModal controller={modalController} />}
    </GroupSettingWrapper>
  );
}

export default GroupSetting;
