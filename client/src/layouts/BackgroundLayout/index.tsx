import React from 'react';
import Layout from './style';

interface Props {
  children: JSX.Element[] | JSX.Element
}

function BackgroundLayout({ children }: Props) {
  return (
    <Layout>
      { children }
    </Layout>
  );
}

export default BackgroundLayout;
