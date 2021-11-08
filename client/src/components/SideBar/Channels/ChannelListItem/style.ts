import styled from 'styled-components';
import Colors from '../../../../styles/Colors';

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 10px;
  margin: 2px 5px;
  border-radius: 5px;
  color: ${Colors.Gray1};
  &:hover {
    background-color: ${Colors.Gray3};
    cursor: pointer;
    color: ${Colors.Black};
  }
  & div {
    display: flex;
    align-items: center;
    & img {
      margin-right: 5px;
    }
    & p {
      max-width: 180px;
      overflow-x: hidden;
    }
  }
`;

export { ListItem };
