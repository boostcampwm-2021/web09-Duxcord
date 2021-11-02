import styled from 'styled-components';
import colors from '../../../styles/colors'

const GroupListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 72px;
  height: 100vh;
  background-color: ${colors.Gray4};
  padding: 32px 0;
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
`;

const Group = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${colors.White};
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
  & img {
    width: 18px;
    height: 18px;
  }
`;

export { GroupListWrapper, GroupList, Group, GroupListDivider, AddGroupButton };