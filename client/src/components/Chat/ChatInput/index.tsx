import React, { FormEvent, useRef, useState } from 'react';

import { useSelectedChannel, useToast } from '@hooks/index';
import { postChat } from '@api/postChat';
import getPresignedUrl from '@api/getPresignedUrl';
import { uploadFileWithPresignedUrl } from '@utils/uploadFile';
import { TOAST_MESSAGE } from '@utils/constants/MESSAGE';
import { FileSelectIcon } from '@components/common/Icons';
import { FileInputWrapper, ChatInputWrapper, Wrapper } from './style';
import { STATUS_CODES } from '@utils/constants/STATUS_CODES';
import FileItem from '../FileItem';

function ChatInput({ onInput }: { onInput: () => void }) {
  const { id } = useSelectedChannel();
  const { fireToast } = useToast();
  const chatInputRef = useRef<HTMLInputElement>(null);

  const onSubmitChat = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (chatInputRef.current === null) return;
      const content = chatInputRef.current ? chatInputRef.current.value.trim() : '';
      if ((content === '' && !fileURL.length) || id === null) return;
      const response = await postChat({ channelID: id, content: content, files: fileURL });
      if (response.status !== STATUS_CODES.OK) throw Error(TOAST_MESSAGE.ERROR.POST_CHAT_FAIL);
      chatInputRef.current.value = '';
      setFileURL([]);
      onInput();
    } catch (e: any) {
      fireToast({ message: TOAST_MESSAGE.ERROR.POST_CHAT_FAIL, type: 'warning' });
      console.error(e.message);
    }
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
        <input ref={chatInputRef} placeholder="Message to channel" type="text" maxLength={255} />
        {fileURL.length !== 0 && (
          <div>
            {fileURL.map((src) => (
              <FileItem key={src} src={src} alt="chat input file" itemType="chatInput" />
            ))}
          </div>
        )}
      </ChatInputWrapper>
    </Wrapper>
  );
}

export default ChatInput;
