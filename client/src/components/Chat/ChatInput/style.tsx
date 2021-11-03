import styled from 'styled-components';
import colors from '../../../styles/colors';

const Wrapper = styled.div`
    background-color: ${colors.White};
    display:grid;
    gap: 2px;
    grid-template-columns:40px auto;
    padding: 20px;
    padding-top: 0;
`

const ButtonWrapper = styled.div`
    background-color:${colors.Gray2};
    border-bottom-left-radius: 12px;
    border-top-left-radius: 12px;
    height:40px;
    display:flex;
    justify-content:center;
    align-items:center;
    &:hover {
        cursor: pointer;
    }
`

const Input = styled.input`
    background-color:${colors.Gray2};
    padding: 12px;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
    height:40px;
    outline: none;
    border: none;
    box-sizing: border-box;
`

export {Wrapper, Input, ButtonWrapper}