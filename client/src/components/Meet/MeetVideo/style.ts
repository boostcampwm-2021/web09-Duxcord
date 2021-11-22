import Colors from '@styles/Colors';
import styled from 'styled-components';

interface IMeetVideoWrapper {
  videoCount: number;
}

const Videos = styled.div<IMeetVideoWrapper>`
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

const VideoWrapper = styled.div`
  width: 100%;
  max-width: 700px;
  height: 100%;
  justify-self: center;
  align-self: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  & p {
    align-self: center;
  }
  .saying {
    border: 3px solid ${Colors.Blue};
  }
  img {
    display: block;
    position: absolute;
  }
`;

const Thumbnail = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  position: absolute;
`;

const Video = styled.video`
  width: 100%;
  max-width: 700px;
  border-radius: 20px;
  justify-self: center;
  align-self: center;
  margin-bottom: 10px;
`;

const VideoSection = styled.section`
  display: flex;
  flex-direction: column;
  background-color: ${Colors.Gray3};
  width: 100%;
  height: 100%;
  padding: 10px;
`;

export { Videos, VideoWrapper, Video, Thumbnail, VideoSection };
