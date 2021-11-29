interface UserData {
  loginID: string;
  username: string;
  thumbnail?: string;
  bio?: string;
  id?: number;
}

interface MeetingUserData extends UserData {
  socketID: string;
}
