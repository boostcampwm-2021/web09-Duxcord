import React, { Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import { useSocket } from '@hooks/index';
import SignIn from '@pages/SignIn';
import SignUp from '@pages/SignUp';
import Main from '@pages/Main';
import Loading from '@pages/Loading';
import NotFound from '@pages/NotFound';
import GlobalStyle from '@styles/GlobalStyle';
import RestrictedRoute from '@components/common/RestrictedRoute';
import Toast from '@components/common/Toast';

function App() {
  const isLoading = useSocket();

  if (isLoading) return <Loading />;

  return (
    <div className="App">
      <GlobalStyle />
      <Toast />
      <Switch>
        <RestrictedRoute signIn={false} redirectPath="/main" exact path="/" component={SignIn} />
        <RestrictedRoute signIn={false} redirectPath="/" path="/signup" component={SignUp} />
        <RestrictedRoute
          signIn={true}
          redirectPath="/"
          path="/main"
          component={() => (
            <Suspense fallback={<Loading />}>
              <Main />
            </Suspense>
          )}
        />
        <Route path="*" component={NotFound} />
      </Switch>
    </div>
  );
}

export default App;
