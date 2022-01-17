const applyDeviceStatus = ({
  stream,
  video,
  audio,
}: {
  stream: MediaStream;
  video: boolean;
  audio: boolean;
}) => {
  stream?.getVideoTracks().forEach((track) => {
    track.enabled = video;
  });
  stream?.getAudioTracks().forEach((track) => {
    track.enabled = audio;
  });
};

const getMyStream = async ({ video, audio }: { video: boolean; audio: boolean }) => {
  let myStream;
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
  } catch (e) {
    const canvas = document.createElement('canvas');
    //TODO 여기도 마찬가지로 너무 구린 방법... global declaration 으로 inteface 정의 할 것
    myStream = (canvas as any).captureStream(0);
  }

  applyDeviceStatus({ stream: myStream, video, audio });

  return myStream;
};

export { getMyStream, applyDeviceStatus };
