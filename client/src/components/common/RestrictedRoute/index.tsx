import React from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { useAccessControl } from '../../../hooks/useAccessControl';

interface Props extends RouteProps {
  signIn: boolean;
  redirectPath: string;
}

function RestrictedRoute({ component: Component, signIn, redirectPath, ...rest }: Props) {
  if (!Component) return null;

  const RestrictedComponent = (props: any) => {
    useAccessControl({ signIn, redirectPath });

    return <Component {...props} />;
  };

  return <Route {...rest} component={RestrictedComponent} />;
}

export default RestrictedRoute;
