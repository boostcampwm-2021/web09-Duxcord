interface ChatData {
  id: number;
  createdAt: string;
  updatedAt: string;
  content: string;
  reactionsCount: number;
  reactions: [];
  threadsCount: number;
  threadWriter: null | User;
  threadLastTime: null | Date;
  user: User;
}

interface User {
  id: number;
  thumbnail: null | string;
  username: string;
}

export { ChatData, User };
