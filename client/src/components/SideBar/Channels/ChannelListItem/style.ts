import styled from 'styled-components';
import colors from '../../../../styles/colors';

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 10px;
  margin: 2px 5px;
  border-radius: 5px;
  color: ${colors.Gray1};
  &:hover {
    background-color: ${colors.Gray3};
    cursor: pointer;
    color: ${colors.Black};
  }
  & div {
    display: flex;
    align-items: center;
    & img {
      margin-right: 5px;
    }
  }
`;

export { ListItem };
