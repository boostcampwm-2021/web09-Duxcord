import React from 'react';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import GlobalStyle from './styles/GlobalStyle';
import { Switch, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <GlobalStyle />
      <Switch>
        <Route exact path="/" component={SignIn} />
        <Route path="/SignUp" component={SignUp} />
      </Switch>
    </div>
  );
}

export default App;
