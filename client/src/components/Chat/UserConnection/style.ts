import styled from 'styled-components';
import Colors from '../../../styles/Colors';

const UserConnectionWrapper = styled.div`
  background-color: ${Colors.Gray4};
  width: 20%;
  height: calc(100vh - 50px);
  padding: 10px;
  overflow-y: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
`;

const Text = styled.div`
  font-size: 21.39px;
`;

const UserImage = styled.img`
  width: 25px;
  height: 25px;
  border-radius: 50%;
`;

const UserTile = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  border-radius: 5px;
  background-color: ${Colors.White};
  width: 100%;
  height: 40px;
  margin-top: 10px;
  margin-bottom: 10px;
  & > div:nth-child(1) {
    border-radius: 25px;
    background-color: ${Colors.Gray1};
    display: flex;
    position: relative;
    width: 25px;
    height: 25px;
    margin: 0 5px 0;
    & > div {
      width: 12px;
      height: 12px;
      border: 2px solid ${Colors.White};
      border-radius: 50%;
      position: absolute;
      bottom: 0;
      right: 0;
    }
    & > .on-line {
      background-color: ${Colors.Green2};
    }
    & > .off-line {
      background-color: ${Colors.Gray1};
    }
  }
`;

export { UserConnectionWrapper, Text, UserImage, UserTile };
