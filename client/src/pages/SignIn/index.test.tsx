import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SignIn from './index';

describe('SignIn은', () => {
  context('정상적으로 그려질 때', () => {
    it('"돌아오신 것을 환영해요!"라는 문자를 보여준다.', () => {
      const { queryByText } = render(<SignIn />);
      expect(queryByText('돌아오신 것을 환영해요!')).toBeInTheDocument();
    })
  })

  it('ID를 입력하면 Input이 바뀐다.',() => {
    const { container } = render(<SignIn />);
    
    fireEvent.change(container.querySelectorAll('input')[0], {
      target: {
        value: 'Duxcord',
      },
    });
    expect(container.querySelectorAll('input')[0]).toHaveValue('Duxcord');
  })
});