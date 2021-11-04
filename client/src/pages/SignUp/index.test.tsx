import React from 'react';
import { render, fireEvent } from '@testing-library/react';
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

  it('ID를 입력하면 Input이 바뀐다.',() => {
    const { container } = renderSignUp();
    
    fireEvent.input(container.querySelectorAll('input')[0], {
      target: {
        value: 'Duxcord',
      },
    });
    expect(container.querySelectorAll('input')[0]).toHaveValue('Duxcord');
  })

  it('사용자 이름을 입력하면 사용자명이 바뀐다.',() => {
    const { container } = renderSignUp();
    
    fireEvent.input(container.querySelectorAll('input')[1], {
      target: {
        value: 'F4',
      },
    });
    expect(container.querySelectorAll('input')[1]).toHaveValue('F4');
  })

  it('password를 입력하면 Input이 바뀐다.',() => {
    const { container } = renderSignUp();
    
    fireEvent.input(container.querySelectorAll('input')[2], {
      target: {
        value: '1234',
      },
    });
    expect(container.querySelectorAll('input')[2]).toHaveValue('1234');
  })

});