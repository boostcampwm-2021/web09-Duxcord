import React from 'react';

import Empty from '@components/common/Empty';
import { LoadingWrapper } from './style';

const NOW_LOADING = '로딩중이에요! 잠시만 기다려주세요!';

function Loading() {
  return (
    <LoadingWrapper>
      <Empty message={NOW_LOADING} />
    </LoadingWrapper>
  );
}

export default Loading;
