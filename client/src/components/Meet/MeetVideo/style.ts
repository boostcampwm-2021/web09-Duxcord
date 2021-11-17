import Colors from '@styles/Colors';
import styled from 'styled-components';

interface IMeetVideoWrapper {
  videoCount: number;
}

const MeetVideoWrapper = styled.div<IMeetVideoWrapper>`
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

const VideoItemWrapper = styled.div`
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

const MyImage = styled.img`
  position: absolute;
`;

const VideoItem = styled.video`
  width: 100%;
  max-width: 700px;
  border-radius: 20px;
  justify-self: center;
  align-self: center;
  margin-bottom: 10px;
`;

export { MeetVideoWrapper, VideoItemWrapper, VideoItem, MyImage };
