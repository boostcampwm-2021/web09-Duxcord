const highlightMyVolume = (stream: MediaStream, myVideo: HTMLVideoElement) => {
  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();
  const microphone = audioContext.createMediaStreamSource(stream);
  const javascriptNode = audioContext?.createScriptProcessor(2048, 1, 1);
  let check = true;
  analyser.smoothingTimeConstant = 0.2;
  analyser.fftSize = 1024;

  microphone.connect(analyser);
  analyser.connect(javascriptNode);
  javascriptNode.connect(audioContext.destination);
  javascriptNode.onaudioprocess = () => {
    if (!check) return;
    const array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);

    const length = array.length;
    const values = array.reduce((acu, v) => acu + v, 0);
    const average = values / length;

    if (Math.round(average) > 30) {
      myVideo.classList.add('saying');
      check = false;
      setTimeout(() => {
        check = true;
      }, 1000);
    } else {
      myVideo.classList.remove('saying');
    }
  };
};

export { highlightMyVolume };
