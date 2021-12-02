import React from 'react';

import { MeetingUserListWrapper, MeetingUserProfileWrapper, MeetingUserProfile } from './style';

interface Props {
  meetingUser: Array<MeetingUserData>;
}

function MeetingUserList({ meetingUser }: Props) {
  return (
    <>
      {meetingUser &&
        meetingUser.map((user: MeetingUserData) => {
          return (
            <MeetingUserListWrapper key={user.socketID}>
              <MeetingUserProfileWrapper>
                <MeetingUserProfile
                  src={user.thumbnail ?? '/images/default_profile.png'}
                  alt="profile"
                />
              </MeetingUserProfileWrapper>
              <p>{`${user.username}(${user.loginID})`}</p>
            </MeetingUserListWrapper>
          );
        })}
    </>
  );
}

export default MeetingUserList;
