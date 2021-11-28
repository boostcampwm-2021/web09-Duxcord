import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { setUserDevice } from '@redux/userDevice/slice';
import { setSelectedUser } from '@redux/selectedUser/slice';
import { useSelectedChannel, useUserdata, useUserDevice, useSelectedUser } from '@hooks/index';
import { socket } from '@utils/socket';
import { SOCKET } from '@utils/constants/SOCKET_EVENT';
import UserInformationModal from '@components/Modal/UserInformation';
import UserEditModal from '@components/Modal/UserEdit';
import {
  CameraOffIcon,
  CameraOnIcon,
  MicOffIcon,
  MicOnIcon,
  SpeakerOffIcon,
  SpeakerOnIcon,
} from '@components/common/Icons';
import { DeviceControl, ProfileWrapper } from './style';

function Profile() {
  const dispatch = useDispatch();
  const { userdata } = useUserdata();
  const device = useUserDevice();
  const { id } = useSelectedChannel();

  const selectedUser = useSelectedUser();

  const [userEditMode, setUserEditMode] = useState(false);
  const userEditModalController = {
    hide: () => setUserEditMode(false),
    show: () => setUserEditMode(true),
  };

  const userInformationModalController = {
    hide: () => dispatch(setSelectedUser({})),
    next: userEditModalController.show,
  };

  const onToggleDevice = (target: 'mic' | 'speaker' | 'cam') => {
    if (target === 'mic') socket.emit(SOCKET.MEET_EVENT.MUTE, id, !device[target]);
    if (target === 'speaker') socket.emit(SOCKET.MEET_EVENT.SPEAKER, id, !device[target]);
    if (target === 'cam') socket.emit(SOCKET.MEET_EVENT.TOGGLE_CAM, id, !device[target]);
    dispatch(setUserDevice({ ...device, [target]: !device[target] }));
  };

  const handleUserSelect = () => {
    dispatch(setSelectedUser({ ...userdata, isOnline: true, isEditable: true }));
  };

  return (
    <ProfileWrapper>
      <div onClick={handleUserSelect}>
        <div>
          <img src={userdata?.thumbnail || '/images/default_profile.png'} alt="profile"></img>
        </div>
        <p>{userdata?.username}</p>
      </div>
      <DeviceControl>
        <div onClick={() => onToggleDevice('mic')}>
          {device.mic ? <MicOnIcon /> : <MicOffIcon />}
        </div>
        <div onClick={() => onToggleDevice('speaker')}>
          {device.speaker ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
        </div>
        <div onClick={() => onToggleDevice('cam')}>
          {device.cam ? <CameraOnIcon /> : <CameraOffIcon />}
        </div>
      </DeviceControl>
      {(selectedUser.id || selectedUser.loginID) && (
        <UserInformationModal controller={userInformationModalController} />
      )}
      {userEditMode && <UserEditModal controller={userEditModalController} />}
    </ProfileWrapper>
  );
}

export default Profile;
