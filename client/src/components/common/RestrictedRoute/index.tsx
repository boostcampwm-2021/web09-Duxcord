import React from 'react';
import { Route, RouteProps } from 'react-router-dom';
import RestrictedComponent from './RestrictedComponent';

interface Props extends RouteProps {
  signIn: boolean;
  redirectPath: string;
}

function RestrictedRoute({ component, signIn, redirectPath, ...rest }: Props) {
  if (!component) return null;

  return (
    <Route
      {...rest}
      component={() => (
        <RestrictedComponent component={component} signIn={signIn} redirectPath={redirectPath} />
      )}
    />
  );
}

export default React.memo(RestrictedRoute);
