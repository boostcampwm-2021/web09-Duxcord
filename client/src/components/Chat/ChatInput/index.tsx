import React, { FormEvent, useRef, useState } from 'react';

import { useSelectedChannel, useToast } from '@hooks/index';
import { postChat } from '@api/postChat';
import { uploadFileWithPresignedUrl } from '@utils/uploadFile';
import { TOAST_MESSAGE } from '@utils/constants/MESSAGE';
import { FileSelectIcon } from '@components/common/Icons';
import { FileInputWrapper, ChatInputWrapper, Wrapper } from './style';
import getPresignedUrl from '@utils/getPresignedUrl';

function ChatInput({ scrollToBottom }: { scrollToBottom: () => void }) {
  const { id } = useSelectedChannel();
  const { fireToast } = useToast();
  const chatInputRef = useRef<HTMLInputElement>(null);

  const onSubmitChat = async (e: FormEvent) => {
    e.preventDefault();
    if (chatInputRef.current === null && !fileURL.length) return;
    const content = chatInputRef.current ? chatInputRef.current.value.trim() : '';
    if ((content === '' && !fileURL.length) || id === null) return;
    postChat({ channelID: id, content: content, files: fileURL });
    if (chatInputRef.current) chatInputRef.current.value = '';
    setFileURL([]);
    scrollToBottom();
  };
  const [fileURL, setFileURL] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLDivElement>(null);
  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const target = e.target as HTMLInputElement;
      if (!target.files) return;
      const file: File = (target.files as FileList)[0];
      if (!file.type.match('image/jpeg|image/png')) return;
      const uploadName = `${new Date().toLocaleString()}-${file.name}`;
      const presignedUrl = await getPresignedUrl(uploadName);
      const uploadedFile = await uploadFileWithPresignedUrl(presignedUrl.url, file);
      if (uploadedFile && fileInputRef && fileInputRef.current) {
        const uploadedURL = 'https://kr.object.ncloudstorage.com/duxcord/' + uploadName;
        setFileURL([...fileURL, uploadedURL]);
        fireToast({ message: TOAST_MESSAGE.SUCCESS.FILE_UPLOAD, type: 'success' });
      }
    } catch (error) {
      fireToast({ message: TOAST_MESSAGE.ERROR.FILE_UPLOAD, type: 'warning' });
    }
  };

  return (
    <Wrapper onSubmit={onSubmitChat}>
      <FileInputWrapper ref={fileInputRef}>
        <FileSelectIcon />
        <input type="file" id="chat_upload" onChange={uploadFile} accept="image/jpeg, image/png" />
      </FileInputWrapper>
      <ChatInputWrapper>
        <input ref={chatInputRef} placeholder="Message to channel" />
        {fileURL.length !== 0 && (
          <div>
            {fileURL.map((url) => (
              <div key={url}>
                <img src={url} alt="chatting images" />
              </div>
            ))}
          </div>
        )}
      </ChatInputWrapper>
    </Wrapper>
  );
}

export default ChatInput;
