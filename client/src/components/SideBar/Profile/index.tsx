import React from 'react';
import { ProfileWrapper } from './style';
import { useDispatch } from 'react-redux';
import { useUserdata, useUserDevice } from '../../../hooks';
import { setUserDevice } from '../../../redux/userDevice/slice';

function Profile() {
  const dispatch = useDispatch();
  const { userdata } = useUserdata();
  const device = useUserDevice();

  const onToggleDevice = (target: 'mic' | 'speaker' | 'cam') => {
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
        <img
          onClick={() => onToggleDevice('mic')}
          src={'/icons/mic' + (device.mic ? 'On' : 'Off') + '.png'}
          alt="micToggle"
        />
        <img
          onClick={() => onToggleDevice('speaker')}
          src={'/icons/speaker' + (device.speaker ? 'On' : 'Off') + '.png'}
          alt="speakerToggle"
        />
        <img
          onClick={() => onToggleDevice('cam')}
          src={'/icons/cam' + (device.cam ? 'On' : 'Off') + '.png'}
          alt="camToggle"
        />
      </div>
    </ProfileWrapper>
  );
}

export default Profile;
