import Colors from '@styles/Colors';
import styled from 'styled-components';

const UserImage = styled.img`
  width: 96px;
  height: 96px;
  border-radius: 50%;
`;

interface IUserDot {
  isOnline: boolean;
}

const UserDot = styled.div<IUserDot>`
  border-radius: 50%;
  width: 36px;
  height: 36px;
  border: 4px solid ${Colors.White};
  background-color: ${(props) => (props.isOnline ? Colors.Green : Colors.Gray1)};
  position: absolute;
  bottom: 8px;
  right: calc(50% - 52px);
`;

const UserImageWrapper = styled.div`
  position: relative;
`;

const UserGridWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
`;

const UserName = styled.div`
  font-size: 20px;
  font-weight: 600;
`;

const UserBio = styled.div`
  margin-top: 20px;
  color: ${Colors.Gray1};
`;

export { UserImage, UserDot, UserImageWrapper, UserGridWrapper, UserName, UserBio };
