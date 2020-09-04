import Head from 'next/head';
import React from 'react';
import LoginButton from '../components/common/LoginButton';
import Layout from '../components/layout';
import withAuth from '../lib/withAuth';

const Login = (props) => {
  return (
    <Layout {...props}>
      <div style={{ textAlign: 'center', margin: '0 20px' }}>
        <Head>
          <title>Log In</title>
          <meta name="description" content="Login and SignUp Page" />
        </Head>
        <br />
        <p style={{ margin: '45px auto', fontSize: '44px', fontWeight: 400 }}>Login</p>
        <p>{"You'll"} be logged in for 14 days unless you log out manually.</p>
        <br />

        <LoginButton />
      </div>
    </Layout>
  );
};

export default withAuth(Login, { logoutRequired: true });
