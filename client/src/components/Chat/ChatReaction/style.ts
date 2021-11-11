import styled from 'styled-components';
import Colors from '../../../styles/Colors';

interface ReactionWrapper {
  isActive: boolean;
}

const Wrapper = styled.div<ReactionWrapper>`
  border-radius: 16px;
  background-color: ${(props) => (props.isActive ? Colors.Yellow2 : Colors.Gray3)};
  box-sizing: border-box;
  padding: 8px 12px;
  width: fit-content;
  margin-top: 12px;
  transition: 0.5s all;
  &:hover {
    cursor: pointer;
    background-color: ${(props) => (props.isActive ? Colors.Yellow : Colors.Gray2)};
  }
`;

export { Wrapper };
