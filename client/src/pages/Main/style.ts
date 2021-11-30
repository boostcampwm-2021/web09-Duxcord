import styled from 'styled-components';

const Layout = styled.div`
  display: flex;
`;

const MainWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: calc(100% - 344px);
  height: 100vh;
`;

const EmptyWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
`;

export { Layout, MainWrapper, EmptyWrapper };
