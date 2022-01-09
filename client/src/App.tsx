import React, { Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import { useSocket } from '@hooks/index';
import Loading from '@pages/Loading';
import NotFound from '@pages/NotFound';
import GlobalStyle from '@styles/GlobalStyle';
import RestrictedRoute from '@components/common/RestrictedRoute';
import Toast from '@components/common/Toast';

const Main = React.lazy(() => import('@pages/Main'));
const SignIn = React.lazy(() => import('@pages/SignIn'));
const SignUp = React.lazy(() => import('@pages/SignUp'));

function App() {
  const isLoading = useSocket();

  if (isLoading) return <Loading />;

  return (
    <div className="App">
      <GlobalStyle />
      <Toast />
      <Suspense fallback={<Loading />}>
        <Switch>
          <RestrictedRoute signIn={false} redirectPath="/main" exact path="/" component={SignIn} />
          <RestrictedRoute signIn={false} redirectPath="/" path="/signup" component={SignUp} />
          <RestrictedRoute signIn={true} redirectPath="/" path="/main" component={Main} />
          <Route path="*" component={NotFound} />
        </Switch>
      </Suspense>
    </div>
  );
}

export default App;
