import React, { useCallback } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import RestrictedComponent from './RestrictedComponent';

interface Props extends Omit<RouteProps, 'component'> {
  component: React.ElementType;
  signIn: boolean;
  redirectPath: string;
}

function RestrictedRoute({ component, signIn, redirectPath, ...rest }: Props) {
  const Component = useCallback(
    () => <RestrictedComponent component={component} signIn={signIn} redirectPath={redirectPath} />,
    [component, redirectPath, signIn],
  );

  return <Route {...rest} component={Component} />;
}

export default React.memo(RestrictedRoute);
