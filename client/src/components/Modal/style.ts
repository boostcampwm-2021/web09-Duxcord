import styled from 'styled-components';
import colors from '../../styles/colors';

const Wrapper = styled.div`
  background-color: ${colors.White};
  padding: 20px;
  border-radius: 16px;
  position: relative;
  max-width: 400px;
  z-index: 999;

  & div {
    text-align: center;
  }
`;

const BottomRightButton = styled.button`
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  color: white;
  background-color: ${(props) => props.color || colors.Black};
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  display: ${(props) => (props.hidden ? 'none' : 'flex')};
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

export { Background, Wrapper, BottomRightButton, Bottom, Title, SubTitle };
