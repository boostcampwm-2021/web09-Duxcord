interface ThreadData {
  id: number;
  createdAt: string;
  content: string;
  user: User;
}

interface User {
  id: number;
  thumbnail: null | string;
  username: string;
}

export { ThreadData, User };
