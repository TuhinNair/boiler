import Head from 'next/head';
import * as React from 'react';

import Layout from '../components/layout';

import { getUserBySlugApiMethod } from '../lib/api/public';

type Props = {
  isMobile: boolean;
  user: { email: string; displayName: string; slug: string; avatarUrl: string };
};

const YourSettings = (props: Props) => {
  const { user } = props;

  return (
    <Layout {...props}>
      <Head>
        <title>Your Settings</title>
        <meta name="description" content="Settings" />
      </Head>
      <div
        style={{
          padding: props.isMobile ? '0px' : '0px 30px',
          fontSize: '15px',
          height: '100%',
        }}
      >
        <h3>Your Settings</h3>
        <h4 style={{ marginTop: '40px' }}>Your account</h4>
        <li>
          Your Email: <b>{user.email}</b>
        </li>
        <li>
          Your Name: <b>{user.displayName}</b>
        </li>
        <p />
        <br />
      </div>
    </Layout>
  );
};

YourSettings.getInitialProps = async () => {
  const slug = 'almost-nihilist';

  const user = await getUserBySlugApiMethod(slug);

  return { ...user };
};

export default YourSettings;
