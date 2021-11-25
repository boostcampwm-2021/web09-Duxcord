import styled from 'styled-components';
import Colors from '../../../../styles/Colors';

interface IListItem {
  selected: boolean;
  isLeader: boolean;
}

const ListItem = styled.li<IListItem>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 10px;
  margin: 2px 5px;
  border-radius: 5px;
  color: ${(props) => (props.selected ? Colors.Black : Colors.Gray1)};
  ${(props) => props.selected && `background-color: ${Colors.Gray2}`};
  ${(props) => props.selected && `font-weight: 600`};
  & > svg {
    display: none;
  }

  &:hover {
    background-color: ${(props) => (props.selected ? Colors.Gray2 : Colors.Gray3)};
    cursor: pointer;
    color: ${Colors.Black};
    .count {
      ${({ isLeader }) => isLeader && 'display:none'};
    }
    & > svg {
      display: inline-block;
    }
  }
  & div {
    display: flex;
    align-items: center;
    & svg {
      width: 24px;
      height: 24px;
      margin-right: 5px;
    }
    & p {
      max-width: 180px;
      overflow-x: hidden;
      overflow-y: hidden;
    }
  }
`;

const ChannelMeetingCount = styled.div`
  font-stretch: expanded;
`;

export { ListItem, ChannelMeetingCount };
