import { useState, useCallback } from 'react';

export const useSelectVideo = () => {
  const [selectedVideo, setSelectedVideo] = useState<SelectedVideo | null>(null);

  const deselectVideo = () => setSelectedVideo(null);
  const selectVideo = useCallback(
    (videoInfo: SelectedVideo) => () => {
      setSelectedVideo((selectedVideo) => {
        if (selectedVideo?.stream?.id === videoInfo?.stream?.id) return null;
        else return { ...videoInfo };
      });
    },
    [],
  );

  return { selectVideo, deselectVideo, selectedVideo, setSelectedVideo };
};
