import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import PretendardWoff2 from "./fonts/PretendardVariable.woff2";

const GlobalStyle = createGlobalStyle`
  ${reset}
  @font-face {
    font-family: 'Pretendard Variable';
    font-weight: 45 920;
    font-style: normal;
    font-display: swap;
    src: local('Pretendard Variable'), url(${PretendardWoff2}) format('woff2-variations');
  }
  * {
    box-sizing: border-box;
    font-family: Pretendard Variable;
  }
`;

export default GlobalStyle;