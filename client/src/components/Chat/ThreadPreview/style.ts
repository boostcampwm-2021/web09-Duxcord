import styled from 'styled-components';
import Colors from '../../../styles/Colors';

const ThreadPreviewWrapper = styled.div`
  margin-top: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  & > img {
    margin-right: 5px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: ${Colors.Gray1};
  }
  & > p:nth-child(2) {
    font-size: 15px;
    font-weight: 600;
    margin-right: 5px;
  }
  & > p:nth-child(3) {
    font-size: 12px;
    color: ${Colors.Gray2};
  }
`;

export { ThreadPreviewWrapper };
