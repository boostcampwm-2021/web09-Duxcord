import React from 'react';
import { MeetingUserListWrapper, MeetingUserProfileWrapper, MeetingUserProfile } from './style';

interface Props {
  meetingUser: any;
}

function MeetingUserList({ meetingUser }: Props) {
  return (
    <>
      {meetingUser &&
        meetingUser[0].map((user: any) => {
          return (
            <MeetingUserListWrapper key={user.id}>
              <MeetingUserProfileWrapper>
                <MeetingUserProfile src="/images/default_profile.png" alt="profile" />
              </MeetingUserProfileWrapper>
              <p>{`${user.username}(${user.loginID})`}</p>
            </MeetingUserListWrapper>
          );
        })}
    </>
  );
}

export default MeetingUserList;
