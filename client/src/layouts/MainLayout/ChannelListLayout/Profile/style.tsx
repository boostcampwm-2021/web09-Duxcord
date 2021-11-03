import styled from 'styled-components';
import colors from '../../../../styles/colors'

const ProfileWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 52px;
  padding: 0 20px;
  background-color: ${colors.Gray3};
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
      background-color: ${colors.White};
      margin-right: 10px;
    }
    & p {
      font-size: 14px;
      font-weight: bold;
    }
  }
  & > div:last-child {
    display: flex;
    align-items: center;
    & img {
      width: 30px;
      height: 30px;
      padding: 5px;
      &:hover {
        cursor: pointer;
        background-color: ${colors.Gray2};
        border-radius: 5px;
      }
    }
  }
`;

export { ProfileWrapper };
