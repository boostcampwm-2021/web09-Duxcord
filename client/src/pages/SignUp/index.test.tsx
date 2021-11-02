import React from 'react';
import { render } from '@testing-library/react';
import SignUp from './index';

describe('SignUp은', () => {
  context('정상적으로 그려질 때', () => {
    it('"계정 만들기"라는 문자를 보여준다.', () => {
      const { queryByText } = render(<SignUp />);
      expect(queryByText('계정 만들기')).toBeInTheDocument();
    })
  })
});