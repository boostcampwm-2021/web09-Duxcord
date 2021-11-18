import styled from 'styled-components';

const EmptyWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  & div {
    display: flex;
    flex-direction: column;
    align-items: center;
    & img {
      width: 120px;
      height: 120px;
      animation: shake 1.5s linear infinite;

      @keyframes shake {
        25% {
          transform: translateX(-3px) rotate(-6deg);
        }
        50% {
          transform: translateX(0) rotate(0deg);
        }
        75% {
          transform: translateX(3px) rotate(6deg);
        }
        100% {
          transform: translateX(0) rotate(0deg);
        }
      }
    }
    & p {
      font-size: 20px;
      font-weight: 600;
    }
  }
`;

export default EmptyWrapper;
