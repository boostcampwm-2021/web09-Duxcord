import styled from 'styled-components';
import colors from '../../../styles/colors'

const ChannelListWrapper = styled.div`
  width: 272px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${colors.Gray6};
`;

const GroupSettingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  padding: 15px;
  border-bottom: 1px solid ${colors.Gray4};
  & > p {
    font-size: 16px;
    font-weight: bold;
  }
  & > div img {
    margin-left: 10px;
  }
`;

const ChannelWrapper = styled.div`
  margin-top: 20px;
`;

const ChannelType = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  & div {
    display: flex;
    align-items: center;
    font-size: 12px;
    font-weight: bold;
    color: ${colors.Gray1};
    & img {
      width: 8px;
      height: 8px;
      margin-right: 8px;
    }
  }
`;

const ChannelList = styled.ul`
  & li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 15px;
    color: ${colors.Gray1};
    & div {
      display: flex;
      align-items: center;
      & img {
        margin-right: 5px;
      }
    }
  }
`;

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
      margin-left: 10px;
    }
  }
`;

export { ChannelListWrapper, GroupSettingWrapper, ChannelWrapper, ChannelType, ChannelList, ProfileWrapper };
