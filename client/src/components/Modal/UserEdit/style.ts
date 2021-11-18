import Colors from '@styles/Colors';
import styled from 'styled-components';

const InputImage = styled.div`
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
  border-radius: 50px;
  border: 4px ${Colors.Gray1} dashed;
  position: relative;
  background-repeat: no-repeat;
  background-position-x: center;
  background-position-y: center;
  background-size: cover;

  & img {
    position: absolute;
    width: 92px;
    top: 10px;
    left: 0;
    z-index: -1;
  }

  &:hover {
    cursor: pointer;
  }

  & input {
    &:hover {
      cursor: pointer;
    }
  }
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

const ErrorDiv = styled.div`
  color: ${Colors.Red};
  width: 240px;
  margin: 8px 0;
`;

export { InputImage, UserImageWrapper, UserGridWrapper, UserName, UserBio, ErrorDiv };
