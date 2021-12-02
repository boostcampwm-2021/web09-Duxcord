import { useState, useEffect } from 'react';

import { socket } from '@utils/index';
import { SOCKET } from '@constants/index';

export const useSocket = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    socket.on(SOCKET.INIT_EVENT.END, () => setIsLoading(false));
    socket.connect();

    return () => {
      socket.off(SOCKET.INIT_EVENT.END);
    };
  }, []);

  return isLoading;
};
