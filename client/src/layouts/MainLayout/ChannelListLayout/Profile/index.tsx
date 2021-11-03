import React from 'react';
import { ProfileWrapper } from './style';

interface Props {
  device: {
    mic: boolean,
    speaker: boolean,
    cam: boolean,
  },
  onToggleDevice: (device: "mic" | "speaker" | "cam") => void;
}

function Profile({ device, onToggleDevice }: Props) {

  return (
    <ProfileWrapper>
        <div>
          <div></div>
          <p>부덕이</p>
        </div>
        <div>
          <img onClick={() => onToggleDevice('mic')} src={"icons/mic" + (device.mic ? 'On' : 'Off') + ".png"} alt="micToggle" />
          <img onClick={() => onToggleDevice('speaker')} src={"icons/speaker" + (device.speaker ? 'On' : 'Off') + ".png"} alt="speakerToggle" />
          <img onClick={() => onToggleDevice('cam')} src={"icons/cam" + (device.cam ? 'On' : 'Off') + ".png"} alt="camToggle" />
        </div>
      </ProfileWrapper>
  );
}

export default Profile;
