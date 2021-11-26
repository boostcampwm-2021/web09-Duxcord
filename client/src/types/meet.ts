export interface MeetingMember {
  socketID: string;
  loginID: string;
  username: string;
  thumbnail: string | null;
  mic: boolean;
  cam: boolean;
  speaker: boolean;
  stream?: MediaStream;
  screen?: MediaStream;
}

export interface SelectedVideo {
  socketID: string;
  loginID: string;
  username: string;
  thumbnail: null | string;
  stream?: MediaStream;
  mic: boolean;
  cam: boolean;
  speaker: boolean;
  isScreen: boolean;
}

export interface StreamIDMetaData {
  camera: string;
  screen: string;
}
