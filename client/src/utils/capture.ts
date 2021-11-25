import { getBrowser } from './browserChecker';
import { TOAST_MESSAGE } from './message';

interface HTMLVideoElementWithCaputreStream extends HTMLVideoElement {
  captureStream(): MediaStream;
}

const CAPTURE = {
  PADDING: 40,
  PADDING_BOTTOM: 120,
  CROP_WIDTH: 350,
  CROP_HEIGHT: 280,
  IMAGE_SIZE: 60,
};

const isWideImage = (imageBitmap: ImageBitmap) =>
  CAPTURE.CROP_HEIGHT / CAPTURE.CROP_WIDTH > imageBitmap.height / imageBitmap.width;

const capture = async () => {
  if (['Firefox', 'Internet Explorer', 'Safari'].includes(getBrowser()))
    throw TOAST_MESSAGE.ERROR.CAPTURE.NOT_SUPPORTED_BROWSER;

  const videos = document.querySelectorAll(
    'video.user-video',
  ) as unknown as Array<HTMLVideoElementWithCaputreStream>;
  if (videos.length === 0) throw TOAST_MESSAGE.ERROR.CAPTURE.NO_VIDEO;
  const canvas = document.createElement('canvas');

  canvas.width = CAPTURE.CROP_WIDTH + 2 * CAPTURE.PADDING;
  canvas.height = (CAPTURE.CROP_HEIGHT + CAPTURE.PADDING) * videos.length + CAPTURE.PADDING_BOTTOM;
  const context = canvas.getContext('2d');

  let index = 0;
  for (const video of videos) {
    const videoStream = video.captureStream().getTracks()[1];
    if (!videoStream) continue;
    const imageCapture = new ImageCapture(videoStream);
    const imageBitmap = await imageCapture.grabFrame();
    const { width: bitmapWidth, height: bitmapHeight } = imageBitmap;
    const isWide = isWideImage(imageBitmap);
    context?.drawImage(
      imageBitmap,
      isWide ? (bitmapWidth - bitmapHeight * (CAPTURE.CROP_WIDTH / CAPTURE.CROP_HEIGHT)) / 2 : 0,
      isWide ? 0 : (bitmapHeight - bitmapWidth * (CAPTURE.CROP_HEIGHT / CAPTURE.CROP_WIDTH)) / 2,
      isWide ? bitmapHeight * (CAPTURE.CROP_WIDTH / CAPTURE.CROP_HEIGHT) : bitmapWidth,
      isWide ? bitmapHeight : bitmapWidth * (CAPTURE.CROP_HEIGHT / CAPTURE.CROP_WIDTH),
      CAPTURE.PADDING,
      index * (CAPTURE.PADDING + CAPTURE.CROP_HEIGHT) + CAPTURE.PADDING,
      CAPTURE.CROP_WIDTH,
      CAPTURE.CROP_HEIGHT,
    );
    index++;
  }

  const logoImage = new Image();
  logoImage.src = '/images/duxcord_logo.png';
  console.log(logoImage);
  logoImage.onload = () => {
    context?.drawImage(
      logoImage,
      canvas.width - CAPTURE.IMAGE_SIZE - CAPTURE.PADDING,
      canvas.height - CAPTURE.IMAGE_SIZE - CAPTURE.PADDING,
      CAPTURE.IMAGE_SIZE,
      CAPTURE.IMAGE_SIZE,
    );

    canvas.toBlob(
      (blob) => {
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = URL.createObjectURL(blob);
        a.download = `화면캡처${new Date()}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      },
      'image/jpeg',
      1,
    );
  };
};

export { capture };
