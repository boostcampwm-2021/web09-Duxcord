import React from 'react';
import { render } from '@testing-library/react';
import ChannelHeaderLayout from './index';

describe('ChannelHeaderLayout은',() => {
  context('정상적으로 그려질 때', () => {
    it('Duxcord를 출력한다.', () => {
      const { queryByText } = render(<ChannelHeaderLayout />);
      expect(queryByText('Duxcord')).toBeInTheDocument();
    });
  });
});
