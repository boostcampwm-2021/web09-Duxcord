import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Colors from '@styles/Colors';

const NotFoundWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 30px;
`;

const HomeLink = styled(Link)`
  text-decoration: none;
  color: ${Colors.Gray1};
`;

const NotFoundMessage = styled.div`
  color: ${Colors.Red};
  font-weight: 900;
  font-size: 40px;
  margin-bottom: 32px;
`;

export { NotFoundWrapper, NotFoundMessage, HomeLink };
