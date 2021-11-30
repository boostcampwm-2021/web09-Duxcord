import { applyDeviceStatus } from '@utils/stream';
import { useEffect } from 'react';
import { useUserDevice } from '.';

export const useControlMyStream = (
  myStreamRef: React.MutableRefObject<MediaStream | undefined>,
) => {
  const { mic, cam } = useUserDevice();
  useEffect(() => {
    if (myStreamRef.current)
      applyDeviceStatus({ stream: myStreamRef.current, video: cam, audio: mic });
  }, [mic, cam]);
};
