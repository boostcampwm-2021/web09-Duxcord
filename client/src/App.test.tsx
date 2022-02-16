import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { Provider } from 'react-redux';
import store from '@redux/store';
import { useToasts, useSocket } from './__mocks__/@hooks';

interface Path {
  path: string;
}

describe('App은', () => {
  const renderApp = ({ path }: Path) => {
    return render(
      <MemoryRouter initialEntries={[path]}>
        <Provider store={store}>
          <App />
        </Provider>
      </MemoryRouter>,
    );
  };

  context('데이터가 없을 때에는', () => {
    it('잠시만 기다려달라는 문구가 출력된다.', () => {
      useSocket.mockImplementationOnce(() => true);
      const { queryByText } = renderApp({ path: '/' });
      expect(queryByText('로딩중이에요! 잠시만 기다려주세요!')).toBeInTheDocument();
    });
  });

  context('path가 "/"이면', () => {
    it('로그인 페이지가 그려진다.', () => {
      useToasts.mockImplementationOnce(() => []);
      const { getByText } = renderApp({ path: '/' });
      expect(getByText('돌아오신 것을 환영해요!')).toBeInTheDocument();
    });

    it('가입하기 버튼을 누르면 회원가입 페이지로 이동한다.', () => {
      useToasts.mockImplementationOnce(() => []);
      const { getByText } = renderApp({ path: '/' });
      fireEvent.click(getByText('가입하기'));
      expect(getByText('계정 만들기')).toBeInTheDocument();
    });
  });

  context('path가 "/SignUp"이면', () => {
    it('회원가입 페이지가 그려진다.', () => {
      useToasts.mockImplementationOnce(() => []);
      const { getByText } = renderApp({ path: '/signup' });
      expect(getByText('계정 만들기')).toBeInTheDocument();
    });
  });

  // context('path가 "/Main"이면', () => {
  //   it('text채널과 meeting채널을 보여준다.', () => {
  //     useToasts.mockImplementationOnce(() => []);
  //     useGroups.mockImplementationOnce(() => ({ groups: [], isValidating: false }));
  //     const { getByText } = renderApp({ path: '/main' });
  //     expect(getByText('TEXT CHANNELS')).toBeInTheDocument();
  //     expect(getByText('MEETING CHANNELS')).toBeInTheDocument();
  //   });
  // });
});
