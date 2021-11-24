import Colors from '@styles/Colors';
import styled from 'styled-components';

interface IWrapper {
  isClosing: boolean;
}
const Wrapper = styled.div<IWrapper>`
  color: ${(props) => (props.color === 'warning' ? Colors.Red : Colors.Black)};
  background-color: white;
  border-radius: 2px;
  position: relative;
  animation: 0.3s forwards ${(props) => (props.isClosing ? 'slideToTop' : 'slideFromRight')};
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

  @keyframes slideToTop {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-100%);
    }
  }
  @keyframes slideFromRight {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const InnerWrapper = styled.div`
  width: 100%;
  padding-top: 16px;
  padding-bottom: 22px;
  padding-right: 28px;
  padding-left: 28px;
`;

interface ILine {
  duration: number;
  type: 'success' | 'warning';
}
const Line = styled.div<ILine>`
  background-color: ${(props) => (props.type === 'warning' ? Colors.DarkRed : Colors.Green)};
  animation: ${(props) => props.duration}s linear timer;
  position: absolute;
  bottom: 0;
  width: 0%;
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

export { Wrapper, InnerWrapper, Line };
