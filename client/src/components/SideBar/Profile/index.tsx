import React from 'react';
import { ProfileWrapper } from './style';
import { useDispatch } from 'react-redux';
import { useSelectedChannel, useUserdata, useUserDevice } from '@hooks/index';
import { setUserDevice } from '../../../redux/userDevice/slice';
import {
  CameraOffIcon,
  CameraOnIcon,
  MicOffIcon,
  MicOnIcon,
  SpeakerOffIcon,
  SpeakerOnIcon,
} from '../../common/Icon';
import { socket } from 'src/util/socket';

function Profile() {
  const dispatch = useDispatch();
  const { userdata } = useUserdata();
  const device = useUserDevice();
  const { id } = useSelectedChannel();

  const onToggleDevice = (target: 'mic' | 'speaker' | 'cam') => {
    if (target === 'mic') socket.emit('mute', id, !device[target], userdata.loginID);
    if (target === 'cam') socket.emit('toggleCam', id, !device[target], userdata.loginID);
    dispatch(setUserDevice({ ...device, [target]: !device[target] }));
  };

  return (
    <ProfileWrapper>
      <div>
        <div>
          <img src={userdata?.thumbnail || '/images/default_profile.png'} alt="profile"></img>
        </div>
        <p>{userdata?.username}</p>
      </div>
      <div>
        <div onClick={() => onToggleDevice('mic')}>
          {device.mic ? <MicOnIcon /> : <MicOffIcon />}
        </div>
        <div onClick={() => onToggleDevice('speaker')}>
          {device.speaker ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
        </div>
        <div onClick={() => onToggleDevice('cam')}>
          {device.cam ? <CameraOnIcon /> : <CameraOffIcon />}
        </div>
      </div>
    </ProfileWrapper>
  );
}

export default Profile;
