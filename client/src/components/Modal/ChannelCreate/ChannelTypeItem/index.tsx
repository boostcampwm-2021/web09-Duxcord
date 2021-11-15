import { CircleDeselectedIcon, CircleSelectedIcon } from '@components/common/Icon';
import { Wrapper, Title, SubTitle } from './style';
import React, { ReactElement } from 'react';

export default function ChannelTypeItem({
  isSelected,
  icon,
  title,
  subTitle,
  channelType,
  setChannelType,
}: {
  isSelected: boolean;
  icon: ReactElement;
  title: string;
  subTitle: string;
  channelType: 'chatting' | 'meeting';
  setChannelType: (channelType: 'chatting' | 'meeting') => void;
}): ReactElement {
  return (
    <Wrapper onClick={() => setChannelType(channelType)}>
      {isSelected ? <CircleSelectedIcon /> : <CircleDeselectedIcon />}
      {icon}
      <div>
        <Title>{title}</Title>
        <SubTitle>{subTitle}</SubTitle>
      </div>
    </Wrapper>
  );
}
