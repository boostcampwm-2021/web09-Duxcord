import Colors from '@styles/Colors';
import styled from 'styled-components';

const UserImage = styled.input`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  border: 4px dashed ${Colors.Gray1};
`;

const UserImageWrapper = styled.div`
  position: relative;
`;

const UserGridWrapper = styled.div`
  display: grid;
  grid-template-columns: 96px 160px auto;
  align-items: center;
  box-sizing: border-box;
  gap: 12px;
`;

const UserName = styled.input`
  font-size: 20px;
  font-weight: 600;
  border: none;
  border-bottom: 1px solid ${Colors.Gray1};

  &:focus {
    outline: none;
    border: none;
    border-bottom: 1px solid ${Colors.Blue};
  }
`;

const UserBio = styled.textarea`
  margin-top: 20px;
  color: ${Colors.Gray1};
  width: 100%;
  border: 1px solid ${Colors.Gray1};
  border-radius: 8px;
  padding: 8px;
  resize: vertical;

  &:focus {
    outline: none;
    border: 2px solid ${Colors.Blue};
  }
`;

export { UserImage, UserImageWrapper, UserGridWrapper, UserName, UserBio };
