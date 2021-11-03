import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import SignUp from './index';

describe('SignUp은', () => {
  const renderSignUp = () => {
    return render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>,
    );
  }

  context('정상적으로 그려질 때', () => {
    it('"계정 만들기"라는 문자를 보여준다.', () => {
      const { queryByText } = renderSignUp();
      expect(queryByText('계정 만들기')).toBeInTheDocument();
    })
  })
});