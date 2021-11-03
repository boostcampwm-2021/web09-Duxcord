import React from 'react';
import { render } from '@testing-library/react';
import ChannelListLayout from './index';

describe('ChannelListLayout은',() => {
  context('정상적으로 그려질 때', () => {
    it('TEXT CHANNELS를 출력한다.', () => {
      const { queryByText } = render(<ChannelListLayout />);
      expect(queryByText('TEXT CHANNELS')).toBeInTheDocument();
    });
  });
});
