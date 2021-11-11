import styled from 'styled-components';
import Colors from '../../styles/Colors';

const MeetWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: calc(100% - 50px);
`;

const VideoSection = styled.section`
  display: flex;
  flex-direction: column;
  background-color: ${Colors.Gray3};
  width: 100%;
  height: 100%;
  padding: 10px;
`;

export { MeetWrapper, VideoSection };
