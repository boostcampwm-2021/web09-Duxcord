import styled from 'styled-components';
import Colors from '../../styles/Colors';

const ChannelListWrapper = styled.div`
  width: 272px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${Colors.Gray6};
`;

const ChannelList = styled.ul`
  height: calc(100vh - 100px);
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export { ChannelListWrapper, ChannelList };
