import styled from 'styled-components';
import colors from '../../../styles/colors';

const ChatWrapper = styled.div`
    background-color: ${colors.White};
    display: grid;
    grid-template-columns: 60px auto;
    padding: 20px 16px;
    &:hover {
        background-color: ${colors.Gray5};
        cursor: pointer;
    }
`

const UserImage = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 25px;
`
const ChatHeader = styled.div`
    display: flex;
    gap: 12px;
    color: ${colors.Gray1};
    margin-bottom: 8px;

    & > div:first-child {
        font-weight: 600;
        font-size: 15px;
        color: ${colors.Black}
    }
`

export {ChatWrapper, UserImage, ChatHeader}