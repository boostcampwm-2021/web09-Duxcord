interface MeetingMember {
  socketID: string;
  loginID: string;
  username: string;
  thumbnail: string | null;
  deviceState: {
    mic: boolean;
    cam: boolean;
    speaker: boolean;
  };
  stream?: MediaStream;
  screen?: MediaStream;
  pc?: RTCPeerConnection;
}

interface SelectedVideo {
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

interface StreamIDMetaData {
  camera: string;
  screen: string;
}
