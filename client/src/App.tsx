import React from 'react';

import SignIn from '@pages/SignIn';
import SignUp from '@pages/SignUp';
import Main from '@pages/Main';
import GlobalStyle from '@styles/GlobalStyle';
import { Switch } from 'react-router-dom';
import RestrictedRoute from '@components/common/RestrictedRoute';
import Toast from '@components/common/Toast';
import { useSocket } from '@hooks/index';
import Loading from '@pages/Loading';

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
        <RestrictedRoute signIn={true} redirectPath="/" path="/main" component={Main} />
      </Switch>
    </div>
  );
}

export default App;
