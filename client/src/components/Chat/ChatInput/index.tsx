import React, { FormEvent, useRef, useState } from 'react';
import { postChat } from '../../../api/postChat';
import { useSelectedChannel } from '@hooks/index';
import { FileSelectIcon } from '../../common/Icons';
import { FileInputWrapper, ChatInputWrapper, Wrapper } from './style';
import { uploadFileToStorage } from 'src/utils/uploadFile';

function ChatInput({ scrollToBottom }: { scrollToBottom: () => void }) {
  const { id } = useSelectedChannel();
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
      const uploadedFile = await uploadFileToStorage(file);
      if (uploadedFile && fileInputRef && fileInputRef.current) {
        setFileURL([...fileURL, uploadedFile]);
      }
    } catch (error) {
      console.log(error);
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
                <img src={url} />
              </div>
            ))}
          </div>
        )}
      </ChatInputWrapper>
    </Wrapper>
  );
}

export default ChatInput;
