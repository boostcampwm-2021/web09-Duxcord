const soundFileNames = ['meet_join.wav', 'meet_leave.wav'];
const SOUNDS_PATH = '/sounds/';
const soundEffects = soundFileNames.map((filename) => new Audio(SOUNDS_PATH + filename));

export const playSoundEffect = (soundEffect: SoundEffect) => {
  try {
    soundEffects[soundEffect].play();
  } catch (e) {
    console.error(e);
  }
};

export enum SoundEffect {
  JoinMeeting,
  LeaveMeeting,
}
