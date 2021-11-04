import styled, { keyframes } from 'styled-components';
import colors from '../../../styles/colors';

const radiusChange = keyframes`
  from { border-radius: 50%; }
  to { border-radius: 30%; }
`;

const GroupListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 72px;
  height: 100vh;
  background-color: ${colors.Gray4};
  padding: 32px 0;
  z-index: 99;
`;

const GroupListDivider = styled.div`
  width: 32px;
  height: 2px;
  background-color: ${colors.Gray2};
  margin: 10px 0;
`;

const GroupList = styled.div`
  & div:not(:last-child) {
    margin-bottom: 10px;
  }
  overflow-y: scroll;
  height: 100%;
`;

const Group = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${colors.White};
  text-align: center;
  overflow: hidden;
  &:hover {
    cursor: pointer;
    animation: ${radiusChange} 0.1s linear both;
  }
`;

const AddGroupButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background-color: ${colors.White};
  &:hover {
    cursor: pointer;
    animation: ${radiusChange} 0.1s linear both;
  }
  & img {
    width: 18px;
    height: 18px;
  }
`;

export { GroupListWrapper, GroupList, Group, GroupListDivider, AddGroupButton };
