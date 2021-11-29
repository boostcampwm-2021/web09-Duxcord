import React from 'react';
import { FileItemWrapper } from './style';

function FileItem({ src, alt, itemType }: { src: string; alt: string; itemType: string }) {
  return (
    <FileItemWrapper itemType={itemType}>
      <img src={src} alt={alt} />
    </FileItemWrapper>
  );
}

export default FileItem;
