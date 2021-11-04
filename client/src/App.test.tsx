import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

interface Path {
  path:string
}

describe('App은', () => {
  const renderApp = ({ path } : Path) => {
    return render(
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>,
    );
  }

  context('정상적으로 그려질 때', () => {
    it('전체를 감싸는 div(id=app)이 그려진다.', () => {
      const { container } = renderApp({ path: '/' })
      expect(container.querySelector('.App')).toBeInTheDocument();
    })
  })

  context('path가 "/"이면', () => {
    it('로그인 페이지가 그려진다.', () => {
      const { getByText } = renderApp({ path: '/' })
      expect(getByText('돌아오신 것을 환영해요!')).toBeInTheDocument();
    })

    it('가입하기 버튼을 누르면 회원가입 페이지로 이동한다.',() => {
      const { getByText } = renderApp({ path: '/' })
      fireEvent.click(getByText('가입하기'))
      expect(getByText('계정 만들기')).toBeInTheDocument();
    })
  })

  context('path가 "/SignUp"이면', () => {
    it('회원가입 페이지가 그려진다.', () => {
      const { getByText } = renderApp({ path: '/SignUp' })
      expect(getByText('계정 만들기')).toBeInTheDocument();
    })
  })

  context('path가 "/Main"이면', () => {
    it('text채널과 meeting채널을 보여준다.', () => {
      const { getByText } = renderApp({ path: '/Main' });
      expect(getByText('TEXT CHANNELS')).toBeInTheDocument();
      expect(getByText('MEETING CHANNELS')).toBeInTheDocument();
    })
  })
});