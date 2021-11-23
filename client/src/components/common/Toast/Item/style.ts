import Colors from '@styles/Colors';
import styled from 'styled-components';

const Wrapper = styled.div`
  color: ${(props) => (props.color === 'warning' ? Colors.Red : Colors.Black)};
  background-color: white;
  border-radius: 12px;
  position: relative;
`;

const GridWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 5fr 1fr;
  padding: 16px;
`;

interface ILine {
  duration: number;
  type: 'success' | 'warning';
}
const Line = styled.div<ILine>`
  background-color: ${(props) => (props.type === 'warning' ? Colors.Red : Colors.Green)};
  animation: ${(props) => props.duration}s linear timer;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 8px;
  border-radius: 2px;

  @keyframes timer {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  } ;
`;

export { Wrapper, GridWrapper, Line };
