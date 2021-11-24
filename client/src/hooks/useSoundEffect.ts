const soundFileNames = ['meet_join.wav', 'meet_leave.wav'];
const SOUND_PATH = '/sounds/';
const soundEffects = soundFileNames.map((filename) => new Audio(SOUND_PATH + filename));

export const useSoundEffect = () => {
  const playSoundEffect = (soundEffect: SoundEffect) => {
    try {
      soundEffects[soundEffect].play();
    } catch (e) {
      console.error(e);
    }
  };

  return playSoundEffect;
};

export enum SoundEffect {
  JoinMeeting,
  LeaveMeeting,
}
