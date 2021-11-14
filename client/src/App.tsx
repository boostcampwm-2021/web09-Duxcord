import React from 'react';

import SignIn from '@pages/SignIn';
import SignUp from '@pages/SignUp';
import Main from '@pages/Main';
import GlobalStyle from '@styles/GlobalStyle';
import { Switch } from 'react-router-dom';
import RestrictedRoute from '@components/common/RestrictedRoute';

function App() {
  return (
    <div className="App">
      <GlobalStyle />
      <Switch>
        <RestrictedRoute signIn={false} redirectPath="/main" exact path="/" component={SignIn} />
        <RestrictedRoute signIn={false} redirectPath="/" path="/signup" component={SignUp} />
        <RestrictedRoute signIn={true} redirectPath="/" path="/main" component={Main} />
      </Switch>
    </div>
  );
}

export default App;
