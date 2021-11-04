interface ChatData {
  id: number;
  createdAt: string;
  updatedAt: string;
  content: string;
  user: {
    id: number;
    thumbnail: null | string;
    username: string;
  };
}

export { ChatData };
