import styled from 'styled-components';

const VideoWrapper = styled.div`
  display: flex;
  width: calc(100% - 300px);
  height: 100%;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  border-radius: 20px;
  justify-self: center;
  align-self: center;
`;

export { VideoWrapper, Video };
