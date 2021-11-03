import React from 'react';
import { ButtonWrapper, Input, Wrapper } from './style';

function ChatInput() {
    return (
        <Wrapper>
            <ButtonWrapper>
                <img src="icons/btn-text-add-file.svg" alt="add file button"/>
            </ButtonWrapper>
            <Input placeholder="Message to channel"/>
        </Wrapper>
    );
};

export default ChatInput;