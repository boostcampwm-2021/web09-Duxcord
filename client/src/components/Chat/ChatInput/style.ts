import styled from 'styled-components';
import Colors from '../../../styles/Colors';

const Wrapper = styled.form`
  background-color: ${Colors.White};
  display: grid;
  gap: 2px;
  grid-template-columns: 40px auto;
  padding: 0 20px 18px 20px;
  width: 100%;
`;

const FileInputWrapper = styled.div`
  background-color: ${Colors.Gray2};
  border-bottom-left-radius: 12px;
  border-top-left-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  & input {
    width: 40px;
    height: 40px;
    opacity: 0;
    &:hover {
      cursor: pointer;
    }
  }
  & svg {
    position: absolute;
    width: 20px;
    height: 20px;
  }
`;

const ChatInputWrapper = styled.div`
  background-color: ${Colors.Gray2};
  padding: 12px;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  box-sizing: border-box;
  width: 100%;
  & > input {
    outline: none;
    border: none;
    width: 100%;
    background-color: inherit;
  }
  & > div {
    margin-top: 5px;
    height: 120px;
    display: flex;
    flex-wrap: wrap;
    overflow: scroll;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export { Wrapper, FileInputWrapper, ChatInputWrapper };
