import React from 'react';
import { FileItemWrapper } from './style';

interface Props {
  src: string;
  alt: string;
  itemType: string;
}

function FileItem({ src, alt, itemType }: Props) {
  return (
    <FileItemWrapper itemType={itemType}>
      <img src={src} alt={alt} />
    </FileItemWrapper>
  );
}

export default FileItem;
