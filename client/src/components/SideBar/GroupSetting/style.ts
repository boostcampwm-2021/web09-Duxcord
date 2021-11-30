import styled from 'styled-components';
import Colors from '@styles/Colors';

const GroupSettingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  padding: 15px;
  z-index: 999;
  border-bottom: 1px solid ${Colors.Gray4};
  &:hover {
    background-color: ${Colors.Gray3};
    cursor: pointer;
  }
  & > p {
    font-size: 16px;
    font-weight: bold;
    overflow-x: hidden;
    overflow-y: hidden;
    max-width: 180px;
  }
  & > div svg {
    margin-left: 10px;
    width: 20px;
    height: 20px;
  }
`;

export { GroupSettingWrapper };
