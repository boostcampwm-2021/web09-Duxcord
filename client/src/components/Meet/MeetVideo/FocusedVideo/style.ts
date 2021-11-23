import Colors from '@styles/Colors';
import styled from 'styled-components';

const VideoWrapper = styled.div`
  position: relative;
  width: calc(100% - 300px);
  height: calc(100% - 160px);
  margin: auto 0;
  margin-left: 20px;
`;

const Video = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 20px;
  background-color: black;
`;

const UserInfo = styled.p`
  position: absolute;
  bottom: 20px;
  left: 20px;
  border-radius: 10px;
  padding: 8px 10px;
  color: ${Colors.White};
  background-color: rgba(0, 0, 0, 0.3);
`;

const DeviceStatus = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 10;

  svg {
    margin-right: 5px;
  }
`;

export { VideoWrapper, Video, UserInfo, DeviceStatus };
