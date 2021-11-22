import styled, { keyframes } from 'styled-components';
import Colors from '../../../styles/Colors';

const radiusChange = keyframes`
  from { border-radius: 50%; }
  to { border-radius: 30%; }
`;

const colorChange = keyframes`
  from {
    border-radius: 50%;
    background-color: ${Colors.White};
  }
  to {
    border-radius: 30%;
    background-color: ${Colors.Blue};
  }
`;

const colorIconChange = keyframes`
  from { stroke: ${Colors.Blue}; }
  to { stroke: ${Colors.White}; }
`;

const colorTextChange = keyframes`
  from { color: ${Colors.Black}; }
  to { color: ${Colors.White}; }
`;

const nameShow = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const GroupListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 72px;
  height: 100vh;
  background-color: ${Colors.Gray4};
  padding: 32px 0;
  z-index: 99;
`;

const GroupListDivider = styled.div`
  width: 32px;
  height: 2px;
  background-color: ${Colors.Gray2};
  margin: 10px 0;
`;

const GroupList = styled.div`
  overflow-y: scroll;
  height: 100%;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

interface IGroupWrapper {
  name: string;
}

interface IGroup {
  thumbnail: string | null;
}

const GroupWrapper = styled.div<IGroupWrapper>`
  display: flex;
  position: relative;
  align-items: center;
  margin: 10px 0;
  width: 48px;
  height: 48px;
  &:hover:after {
    content: '${(props) => props.name}';
    position: fixed;
    left: 70px;
    background-color: ${Colors.White};
    padding: 12px;
    border-radius: 6px;
    animation: ${nameShow} 0.1s linear both;
  }
`;

const GroupItem = styled.div<IGroup>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid ${Colors.White};
  text-align: center;
  overflow: hidden;
  ${(props) =>
    props.thumbnail
      ? `
        background-image: url('${props.thumbnail}');
        background-size: cover;
        background-repeat: no-repeat;
        background-position-x: center;
        background-position-y: center;
      `
      : `background-color: ${Colors.White};`}
  &:hover {
    cursor: pointer;
    animation: ${(props) => (props.thumbnail ? radiusChange : colorChange)} 0.1s linear both;
    & p {
      animation: ${colorTextChange} 0.1s linear both;
    }
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
  background-color: ${Colors.White};
  &:hover {
    cursor: pointer;
    animation: ${colorChange} 0.1s linear both;
    & path {
      animation: ${colorIconChange} 0.1s linear both;
    }
  }
  & svg {
    width: 30px;
    height: 30px;
    & path {
      stroke: ${Colors.Blue};
    }
  }
`;

export { GroupListWrapper, GroupList, GroupWrapper, GroupItem, GroupListDivider, AddGroupButton };
