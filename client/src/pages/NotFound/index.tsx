import React from 'react';

import Empty from '@components/common/Empty';
import { NotFoundWrapper, NotFoundMessage, HomeLink } from './style';

const NOT_FOUND = '요청하신 페이지를 찾을 수 없습니다.';

function NotFound() {
  return (
    <NotFoundWrapper>
      <NotFoundMessage>404 NOT FOUND</NotFoundMessage>
      <Empty message={NOT_FOUND} />
      <HomeLink to="/">홈으로 가기</HomeLink>
    </NotFoundWrapper>
  );
}

export default NotFound;
