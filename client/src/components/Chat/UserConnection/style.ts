import styled from 'styled-components';
import Colors from '../../../styles/Colors';

const UserConnectionWrapper = styled.div`
  background-color: ${Colors.Gray6};
  width: 30%;
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
  margin-top: 20px;
  font-size: 21.39px;
`;

const UserImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserTile = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  border-radius: 5px;
  background-color: ${Colors.White};
  width: 100%;
  height: 40px;
  margin: 10px 0;
  padding: 30px 20px;
  & > div:nth-child(1) {
    border-radius: 25px;
    background-color: ${Colors.Gray1};
    display: flex;
    position: relative;
    width: 30px;
    height: 30px;
    margin-right: 10px;
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
