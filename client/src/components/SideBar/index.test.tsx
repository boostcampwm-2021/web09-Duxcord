import React from 'react';
import { render } from '@testing-library/react';
import SideBar from './index';

describe('GroupListLayout은', () => {
  context('정상적으로 그려질 때', () => {
    it('TEXT CHANNELS를 출력한다.', () => {
      const { queryByText } = render(<SideBar />);
      expect(queryByText('TEXT CHANNELS')).toBeInTheDocument();
    });
  });
});
