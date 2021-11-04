import React from 'react';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Main from './pages/Main';
import GlobalStyle from './styles/GlobalStyle';
import { Switch, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <GlobalStyle />
      <Switch>
        <Route exact path="/" component={SignIn} />
        <Route path="/SignUp" component={SignUp} />
        <Route path="/Main" component={Main} />
      </Switch>
    </div>
  );
}

export default App;
