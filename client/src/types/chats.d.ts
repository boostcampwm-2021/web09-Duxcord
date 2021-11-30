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
  user: UserData;
  files: FileData[];
}

interface FileData {
  src: string;
}
