import { InitEvent } from '@customTypes/socket/InitEvent';
import { useState, useEffect } from 'react';
import { socket } from '@utils/socket';

export const useSocket = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    socket.on(InitEvent.INIT_END, () => setIsLoading(false));
    socket.connect();

    return () => {
      socket.off(InitEvent.INIT_END);
    };
  }, []);

  return isLoading;
};
