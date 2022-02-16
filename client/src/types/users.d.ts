interface UserData {
  id?: number;
  loginID: string;
  username: string;
  thumbnail?: string | null;
  bio?: string;
}

interface MeetingUserData extends UserData {
  socketID: string;
}
