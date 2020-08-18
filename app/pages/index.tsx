import Head from 'next/head';
import Button from '@material-ui/core/Button';
import React from 'react';

import Link from 'next/link';

import Layout from '../components/layout';

import notify from '../lib/notify';

const Index = () => (
  <Layout firstGridItem={true}>
    <div>
      <Head>
        <title>Index Page</title>
        <meta name="description" content="This is a description of the Index Page" />
      </Head>
      <div style={{ padding: '0px 30px', fontSize: '15px', height: '100%' }}>
        <p>Welcome to the Index :)</p>
        <Link href="/csr-page" as="/csr-page">
          <a>Go to CSR Page</a>
        </Link>
        <p />
        <Button variant="contained" onClick={() => notify('this happened')}>
          Open Notifier
        </Button>
      </div>
    </div>
  </Layout>
);

export default Index;
