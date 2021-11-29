interface UserData {
  loginID: string;
  username: string;
  thumbnail?: string;
  bio?: string;
}

interface MeetingUserData extends UserData {
  socketID: string;
}
