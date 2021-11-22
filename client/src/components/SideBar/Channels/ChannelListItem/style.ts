import styled from 'styled-components';
import Colors from '../../../../styles/Colors';

interface IListItem {
  selected: boolean;
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

  &:hover {
    background-color: ${(props) => (props.selected ? Colors.Gray2 : Colors.Gray3)};
    cursor: pointer;
    color: ${Colors.Black};
  }
  & div {
    display: flex;
    align-items: center;
    & svg {
      margin-right: 5px;
      z-index: 99;
    }
    & p {
      max-width: 180px;
      overflow-x: hidden;
      overflow-y: hidden;
    }
  }
`;

export { ListItem };
