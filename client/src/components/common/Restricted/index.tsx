import { useAccessControl } from '@hooks/index';
import React from 'react';

interface Props {
  children: JSX.Element;
  signIn: boolean;
  redirectPath: string;
}

function Restricted({ children, signIn, redirectPath }: Props) {
  useAccessControl({ signIn, redirectPath });

  return children;
}

export default React.memo(Restricted);
