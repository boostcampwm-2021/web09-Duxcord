import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import { useSocket } from '@hooks/index';
import Loading from '@pages/Loading';
import NotFound from '@pages/NotFound';
import GlobalStyle from '@styles/GlobalStyle';
import Restricted from '@components/common/Restricted';
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
        <Routes>
          <Route
            path="/"
            element={
              <Restricted signIn={false} redirectPath="/main">
                <SignIn />
              </Restricted>
            }
          />
          <Route
            path="/signup"
            element={
              <Restricted signIn={false} redirectPath="/">
                <SignUp />
              </Restricted>
            }
          />
          <Route
            path="/main"
            element={
              <Restricted signIn={true} redirectPath="/">
                <Main />
              </Restricted>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
