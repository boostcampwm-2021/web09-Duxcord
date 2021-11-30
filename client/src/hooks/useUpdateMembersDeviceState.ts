import { SOCKET } from '@utils/constants/SOCKET_EVENT';
import { socket } from '@utils/socket';
import { useEffect } from 'react';

export const useUpdateMembersDeviceState = (
  setMeetingMembers: React.Dispatch<React.SetStateAction<MeetingMember[]>>,
  setSelectedVideo: React.Dispatch<React.SetStateAction<SelectedVideo | null>>,
) => {
  useEffect(() => {
    socket.on(SOCKET.MEET_EVENT.SET_DEVICE_STATE, (deviceState, socketID) => {
      setMeetingMembers((members) => {
        const member = members.find((member) => member.socketID === socketID);
        if (!member) return members;
        setSelectedVideo((selectedVideo) =>
          selectedVideo?.socketID === member.socketID
            ? { ...selectedVideo, ...deviceState }
            : selectedVideo,
        );
        member.deviceState = deviceState;

        return [...members];
      });
    });

    return () => {
      socket.off(SOCKET.MEET_EVENT.SET_DEVICE_STATE);
    };
  }, [setSelectedVideo]);
};
