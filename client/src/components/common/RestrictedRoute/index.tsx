import React from 'react';
import useSWR from 'swr';
import { API_URL } from '../../../api/API_URL';
import { getFetcher } from '../../../util/fetcher';
import { Route, Redirect, RouteProps } from 'react-router-dom';

interface Props extends RouteProps {
  signIn: boolean;
  redirectPath: string;
}

function RestrictedRoute({ component: Component, signIn, redirectPath, ...rest }: Props) {
  const { data: userdata } = useSWR(API_URL.user.getUserdata, getFetcher);
  if (!Component) return null;
  const accessible = (signIn && userdata) || (!signIn && !userdata);

  return (
    <Route
      {...rest}
      render={(props) => (accessible ? <Component {...props} /> : <Redirect to={redirectPath} />)}
    />
  );
}

export default RestrictedRoute;
