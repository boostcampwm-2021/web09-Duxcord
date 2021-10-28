import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

describe('App은', () => {
  context('정상적으로 그려질 때', () => {
    it('START라는 텍스트를 화면에 그린다.', () => {
      const { queryByText } = render(<App />);
      expect(queryByText('START')).toBeInTheDocument();
    })
  })
});