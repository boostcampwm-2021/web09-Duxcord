import styled from 'styled-components';

const EmptyWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  & p {
    font-size: 20px;
    font-weight: 600;
  }
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
`;

export default EmptyWrapper;
