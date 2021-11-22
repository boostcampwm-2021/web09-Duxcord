import Colors from '@styles/Colors';
import styled, { css } from 'styled-components';

interface VideosProps {
  videoCount: number;
  focused: boolean;
}

const normal = css<VideosProps>`
  margin: 0 auto;
  display: grid;
  width: 100%;
  height: 90%;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 20px;
  ${(props) =>
    props.videoCount <= 2 ? 'grid-template-rows: 100%;' : 'grid-template-rows: 50% 50%;'}
  ${(props) =>
    props.videoCount <= 4
      ? 'max-width: 900px; grid-template-columns: repeat(auto-fit, minmax(45%, 1fr));'
      : 'max-width: 1500px; grid-template-columns: repeat(auto-fit, minmax(30%, 1fr));'}
`;

const focused = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 300px;
  max-width: 300px;
  height: 100%;
  padding: 20px;
`;

const Videos = styled.div<VideosProps>`
  ${(props) => (props.focused ? focused : normal)}
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }

  &::-webkit-scrollbar-thumb {
    background: ${Colors.Gray2};
    border-radius: 10px;
  }

  &:hover::-webkit-scrollbar {
    display: block;
    width: 15px;
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 700px;
  height: 0;
  padding-bottom: 56.25%;
  margin-bottom: 10px;

  & p {
    position: absolute;
    bottom: 10px;
    left: 10px;
    padding: 3px 8px;
    border-radius: 5px;
    color: ${Colors.White};
    background-color: rgba(255, 255, 255, 0.3);
  }
  .saying {
    border: 3px solid ${Colors.Blue};
  }
`;

const ThumbnailWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 100%;
`;

const SelectVideoIndicator = styled(ThumbnailWrapper)`
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 20px;

  svg {
    width: 80px;
    height: 80px;
  }
`;

const Thumbnail = styled.img`
  display: block;
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
`;

const Video = styled.video`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 20px;
  background-color: black;
`;

const DeviceStatus = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 10;

  svg {
    margin-right: 5px;
  }
`;

const VideoSection = styled.section`
  display: flex;
  justify-content: end;
  background-color: ${Colors.Gray3};
  width: 100%;
  height: 100%;
`;

export {
  Videos,
  VideoWrapper,
  Video,
  Thumbnail,
  ThumbnailWrapper,
  VideoSection,
  DeviceStatus,
  SelectVideoIndicator,
};
