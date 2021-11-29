import styled from 'styled-components';

interface IFileNameWrapper {
  itemType: string;
}

const fileImgType = (type: string) => {
  switch (type) {
    case 'chat':
      return 'max-width: 300px; height: 120px; margin-right: 10px; object-fit: cover;';
    case 'chatInput':
      return 'width: 120px; height: 120px; margin-right: 10px;';
    case 'thread':
      return 'max-width: 200px; height: 120px; object-fit: cover;';
  }
};

const FileItemWrapper = styled.div<IFileNameWrapper>`
  margin-top: 10px;
  & img {
    ${({ itemType }) => fileImgType(itemType)}
  }
`;

export { FileItemWrapper };
