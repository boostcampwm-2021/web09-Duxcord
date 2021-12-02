import styled from 'styled-components';
import Colors from '@styles/Colors';

interface IHideAnimation {
  isHidden: boolean;
}

const Wrapper = styled.div<IHideAnimation>`
  background-color: ${Colors.White};
  padding: 20px;
  border-radius: 16px;
  position: relative;
  max-width: 400px;
  z-index: 999;
  min-width: 300px;
  animation: ${(props) => (props.isHidden ? 'zoomOut' : 'zoomIn')} 0.3s forwards;

  &:hover {
    cursor: default;
  }

  & div {
    text-align: center;
  }

  @keyframes zoomIn {
    0% {
      transform: scale(0.6);
    }
    40% {
      transform: scale(1);
    }
    60% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes zoomOut {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0.9);
    }
  }
`;

const BottomLeftButton = styled.button`
  border: none;
  background-color: white;

  &:hover {
    cursor: pointer;
  }
`;

const BottomRightButton = styled.button`
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  color: white;
  background-color: ${(props) => props.color || Colors.Black};

  &:hover {
    cursor: pointer;
  }
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
`;

const Top = styled.div`
  display: flex;
  justify-content: flex-end;

  & svg {
    &:hover {
      cursor: pointer;
    }
  }
`;

const Background = styled.div<IHideAnimation>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 998;
  display: flex;
  animation: ${(props) => (props.isHidden ? 'fadeOut' : 'fadeIn')} 0.3s forwards;
  backdrop-filter: blur(1px);

  &:hover {
    cursor: default;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

const Title = styled.h1`
  font-size: 20px;
  text-align: center;
  font-weight: 600;
  margin-bottom: 12px;
`;

const SubTitle = styled.h2`
  margin-bottom: 20px;
`;

export { Background, Wrapper, BottomRightButton, BottomLeftButton, Bottom, Top, Title, SubTitle };
