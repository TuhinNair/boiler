import Button from '@material-ui/core/Button';
import React from 'react';
import Head from 'next/head';

const CSRPage = () => (
  <div>
    <Head>
      <title>CSR Page</title>
      <meta name="description" content="This is a description of the CSR Page " />
    </Head>
    <div style={{ padding: '0px 30px', fontSize: '15px', height: '100%' }}>
      <p>Content on CSR Page</p>
      <Button variant="outlined">Some button</Button>
    </div>
  </div>
);

export default CSRPage;
