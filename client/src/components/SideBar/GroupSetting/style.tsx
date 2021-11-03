import styled from 'styled-components';
import colors from '../../../styles/colors';

const GroupSettingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  padding: 15px;
  border-bottom: 1px solid ${colors.Gray4};
  &:hover {
    background-color: ${colors.Gray3};
    cursor: pointer;
  }
  & > p {
    font-size: 16px;
    font-weight: bold;
  }
  & > div img {
    margin-left: 10px;
  }
`;

export { GroupSettingWrapper };
