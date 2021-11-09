interface ChatData {
  id: number;
  createdAt: string;
  updatedAt: string;
  content: string;
  reactionsCount: number;
  user: {
    id: number;
    thumbnail: null | string;
    username: string;
  };
}

export { ChatData };
