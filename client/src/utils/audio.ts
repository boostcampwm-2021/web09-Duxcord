const highlightMyVolume = (stream: MediaStream, myVideo: HTMLVideoElement) => {
  try {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    const javascriptNode = audioContext?.createScriptProcessor(2048, 1, 1);
    analyser.smoothingTimeConstant = 0.2;
    analyser.fftSize = 1024;

    let check = true;
    const interval = 1000;

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
      const minimumVolume = 30;
      if (Math.round(average) > minimumVolume) {
        myVideo.classList.add('saying');
        check = false;
        setTimeout(() => {
          check = true;
        }, interval);
      } else {
        myVideo.classList.remove('saying');
      }
    };
  } catch (e) {
    console.error(e);
  }
};

export { highlightMyVolume };
