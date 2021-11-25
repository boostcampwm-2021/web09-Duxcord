export interface Group {
  id: number;
  name: string;
  code: string;
  thumbnail: null | string;
  leader: {
    loginID: string;
  };
  meetingChannels: MeetingChannel[];
  chattingChannels: ChattingChannel[];
}

interface MeetingChannel {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
}

interface ChattingChannel extends MeetingChannel {}
