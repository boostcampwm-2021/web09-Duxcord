import React from 'react';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import GlobalStyle from './styles/GlobalStyle';
import { Switch, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <div className="App">
      <GlobalStyle />
      <Switch>
        <Route exact path="/" component={SignIn} />
        <Route path="/SignUp" component={SignUp} />
        <Route path="/Main" component={MainLayout} />
      </Switch>
    </div>
  );
}

export default App;
