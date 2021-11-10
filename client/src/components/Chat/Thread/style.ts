import styled from 'styled-components';
import Colors from '../../../styles/Colors';

const Wrapper = styled.form`
  background-color: ${Colors.White};
  display: grid;
  gap: 2px;
  grid-template-columns: 40px auto;
  padding: 20px;
  padding-top: 0;
`;

const ThreadWrapper = styled.div`
  background-color: ${Colors.White};
  width: 30%;
  border-left: 1px solid ${Colors.Gray4};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ThreadHeaderWrapper = styled.div`
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${Colors.Gray4};
  & > img {
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
  height: calc(100vh - 270px);
  overflow-y: scroll;
`;
const OrginalChatWrapper = styled.div`
  border-bottom: 1px solid ${Colors.Gray4};
  padding: 20px;
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
    margin-left: 30px;
    justify-content: space-between;
    width: 100%;
    word-break: break-all;
  }
  & > div > div {
    display: flex;
    align-items: center;
    & > p:first-child {
      font-weight: 700px;
      margin-right: 5px;
    }
    & > p:not(:first-child) {
      font-size: 13px;
    }
  }
`;

const ButtonWrapper = styled.div`
  background-color: ${Colors.Gray2};
  border-bottom-left-radius: 12px;
  border-top-left-radius: 12px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    cursor: pointer;
  }
`;

const Input = styled.input`
  background-color: ${Colors.Gray2};
  padding: 12px;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  height: 40px;
  outline: none;
  border: none;
  box-sizing: border-box;
`;

export {
  Wrapper,
  Input,
  ButtonWrapper,
  ThreadWrapper,
  ThreadHeaderWrapper,
  OrginalChatWrapper,
  ThreadChatWrapper,
};
