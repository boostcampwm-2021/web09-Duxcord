import styled from 'styled-components';
import colors from '../../../styles/colors';

const Wrapper = styled.div`
    background-color: ${colors.White};
    display:grid;
    gap: 2px;
    grid-template-columns:40px auto;
    padding: 20px;
    padding-top: 0px;
    position: fixed;
    bottom: 0;
    left:0;
    right:0;
`

const ButtonWrapper = styled.div`
    background-color:${colors.Gray2};
    border-bottom-left-radius: 8px;
    border-top-left-radius: 8px;
    height:40px;
`

const Input = styled.input`
    background-color:${colors.Gray2};
    padding: 20px;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    height:40px;
    outline: none;
    border: none;
    box-sizing: border-box;
`

export {Wrapper, Input, ButtonWrapper}