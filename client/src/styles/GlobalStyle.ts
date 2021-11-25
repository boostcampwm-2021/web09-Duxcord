import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import Colors from './Colors';

const GlobalStyle = createGlobalStyle`
  ${reset}
  @font-face {
    font-family: 'Pretendard Variable';
    font-weight: 45 920;
    font-style: normal;
    font-display: swap;
    src: local('Pretendard Variable'), url("/fonts/PretendardVariable.woff2") format('woff2-variations');
  }
  
  * {
    box-sizing: border-box;
  }

  body {
    font-family: Pretendard Variable;
    width: 100vw;
    min-width: 1100px;
    height: 100vh;
    background-color: ${Colors.White};
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
    }
  }
`;

export default GlobalStyle;
