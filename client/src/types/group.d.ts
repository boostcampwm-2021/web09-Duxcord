interface GroupData {
  id: number;
  name: string;
  code: string;
  thumbnail: null | string;
  leader: {
    loginID: string;
  };
  meetingChannels: MeetingChannelData[];
  chattingChannels: ChattingChannelData[];
}

interface GroupMemberData {
  user: Array<UserData>;
}

interface ChannelData {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
}

interface MeetingChannelData extends ChannelData {}

interface ChattingChannelData extends ChannelData {}
