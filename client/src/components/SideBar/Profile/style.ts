import styled from 'styled-components';
import Colors from '../../../styles/Colors';

const ProfileWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 52px;
  padding: 0 20px;
  background-color: ${Colors.Gray3};
  & > div:first-child {
    display: flex;
    align-items: center;
    &:hover {
      cursor: pointer;
    }
    & div {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: ${Colors.White};
      margin-right: 10px;
      & img {
        width: 32px;
        height: 32px;
        object-fit: cover;
        border-radius: 50%;
      }
    }
    & p {
      font-size: 14px;
      font-weight: bold;
      max-width: 100px;
    }
  }
`;

const DeviceControl = styled.div`
  display: flex;
  align-items: center;
  & svg {
    width: 30px;
    height: 30px;
    padding: 5px;
    &:hover {
      cursor: pointer;
      background-color: ${Colors.Gray2};
      border-radius: 5px;
    }
  }
`;

export { ProfileWrapper, DeviceControl };
