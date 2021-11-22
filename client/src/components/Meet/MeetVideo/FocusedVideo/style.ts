import Colors from '@styles/Colors';
import styled from 'styled-components';

const VideoWrapper = styled.div`
  position: relative;
  display: flex;
  width: calc(100% - 300px);
  height: 100%;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  justify-self: center;
  align-self: center;
  object-fit: contain;
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
