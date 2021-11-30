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

const getMyStream = async () => {
  let myStream;
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
  } catch (e) {
    const canvas = document.createElement('canvas');
    myStream = canvas.captureStream(0);
  }

  return myStream;
};

export { getMyStream, applyDeviceStatus };
