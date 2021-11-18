enum MeetEvent {
  meeting = 'meeting',
  meetChat = 'meetChat',
  joinMeeting = 'joinMeeting',
  allMeetingMembers = 'allMeetingMembers',
  candidate = 'candidate',
  offer = 'offer',
  answer = 'answer',
  leaveMember = 'leaveMember',
  leaveMeeting = 'leaveMeeting',
  MeetingChannelList = 'MeetingChannelList',
  MeetingUserList = 'MeetingUserList',
  someoneIn = 'someoneIn',
  someoneOut = 'someoneOut',
  mute = 'mute',
  setMuted = 'setMuted',
  toggleCam = 'toggleCam',
  setToggleCam = 'setToggleCam',
  speaker = 'speaker',
  setSpeaker = 'setSpeaker',
}

export default MeetEvent;
