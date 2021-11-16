import styled from 'styled-components';
import Colors from '@styles/Colors';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 36px 36px auto;
  align-items: center;
  height: 52px;
  border-radius: 4px;
  text-align: left;
  background-color: ${Colors.Gray6};
  min-width: 320px;
  padding: 8px;

  /*
  & svg:first-child {
    &:hover {
      cursor: pointer;
    }
  }*/
`;

const Title = styled.div`
  color: ${Colors.Gray1};
  font-size: 18px;
  text-align: left !important;
  margin-bottom: 8px;
`;

const SubTitle = styled.div`
  color: ${Colors.Gray4};
  font-size: 14px;
  text-align: left !important;
`;

export { Wrapper, Title, SubTitle };
