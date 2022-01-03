import { useAccessControl } from '@hooks/index';
import React from 'react';

interface Props {
  component: React.ElementType;
  signIn: boolean;
  redirectPath: string;
}

function RestrictedComponent({ component: Component, signIn, redirectPath, ...props }: Props) {
  useAccessControl({ signIn, redirectPath });

  return <Component {...props} />;
}

export default React.memo(RestrictedComponent);
