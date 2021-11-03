import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('App은', () => {

  const renderApp = ({ path }) => {
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
});