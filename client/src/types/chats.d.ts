interface ChatData {
  id: number;
  createdAt: string;
  updatedAt: string;
  content: string;
  reactionsCount: number;
  reactions: [];
  threadCount: 0;
  lastThreadUser: null | User;
  user: User;
}

interface User {
  id: number;
  thumbnail: null | string;
  username: string;
}

export { ChatData, User };
