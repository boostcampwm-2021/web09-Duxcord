import styled from 'styled-components';
import Colors from '../../../styles/Colors';

const Wrapper = styled.div`
  background-color: ${Colors.White};
  width: 30%;
  height: calc(100vh - 50px);
  border-left: 1px solid ${Colors.Gray4};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ThreadWrapper = styled.div`
  height: calc(100vh - 110px);
  display: flex;
  flex-direction: column;
`;

const ThreadHeaderWrapper = styled.div`
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${Colors.Gray4};
  & > svg {
    width: 15px;
    height: 15px;
    cursor: pointer;
  }
  & > div {
    height: 45px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    & > div:first-child {
      font-size: 20px;
      font-weight: 700;
    }
  }
`;

const ThreadChatWrapper = styled.div`
  flex: 1;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  &::-webkit-scrollbar-thumb {
    background: ${Colors.Gray2};
    border-radius: 10px;
  }
  &:hover::-webkit-scrollbar {
    display: block;
    width: 15px;
  }
`;

const OriginalChatWrapper = styled.div`
  border-bottom: 1px solid ${Colors.Gray4};
  padding: 20px 20px 40px;
  display: flex;
  & > img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${Colors.Gray2};
  }
  & > div {
    display: flex;
    flex-direction: column;
    margin-left: 15px;
    justify-content: space-between;
    width: 100%;
    word-break: break-all;
  }
  & > div > div {
    display: flex;
    align-items: center;
    margin: 5px 0;
    & > p:first-child {
      font-size: 16px;
      font-weight: 700;
      margin-right: 5px;
    }
    & > p:last-child {
      font-size: 13px;
      line-height: 16px;
      color: ${Colors.Gray1};
    }
  }
`;

const ChatLengthWrapper = styled.p`
  margin-top: -9.5px;
  background-color: ${Colors.White};
  padding: 0 12px;
  display: table;
`;

const InputWrapper = styled.form`
  background-color: ${Colors.White};
  padding: 0 20px 18px 20px;
`;

const Input = styled.input`
  width: 100%;
  background-color: ${Colors.Gray2};
  padding: 12px;
  border-radius: 12px;
  height: 40px;
  outline: none;
  border: none;
  box-sizing: border-box;
`;

const FileWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-height: 200px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${Colors.Gray2};
    border-radius: 10px;
  }
  & div {
    margin-top: 10px;
  }
  & img {
    max-width: 200px;
    height: 120px;
    object-fit: cover;
  }
`;

export {
  InputWrapper,
  Input,
  Wrapper,
  FileWrapper,
  ThreadWrapper,
  ThreadHeaderWrapper,
  OriginalChatWrapper,
  ThreadChatWrapper,
  ChatLengthWrapper,
};
