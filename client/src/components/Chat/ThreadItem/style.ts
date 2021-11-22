import styled from 'styled-components';
import Colors from '../../../styles/Colors';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 40px auto;
  gap: 12px;
  padding: 20px;
  border-bottom: 1px solid ${Colors.Gray4};
  & > img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${Colors.Gray2};
  }
  & > div {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  & > div > div {
    display: flex;
    gap: 8px;
    word-break: break-all;
  }
  & h2 {
    font-size: 16px;
    font-weight: 700;
  }
  & p {
    color: ${Colors.Gray1};
    font-size: 13px;
    line-height: 16px;
  }
`;

export { Wrapper };
