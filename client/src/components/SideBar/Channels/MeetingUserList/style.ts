import styled from 'styled-components';
import Colors from '../../../../styles/Colors';

const MeetingUserListWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 5px;
  padding: 3px 15px;
  cursor: pointer;
  & p {
    font-size: 14px;
    color: ${Colors.Gray1};
  }
  &:hover {
    border-radius: 5px;
    background-color: ${Colors.Gray3};
    color: ${Colors.Black};
  }
`;

const MeetingUserProfileWrapper = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 5px;
  background-color: ${Colors.Gray2};
`;

const MeetingUserProfile = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
`;

export { MeetingUserListWrapper, MeetingUserProfileWrapper, MeetingUserProfile };
