import Head from 'next/head';
import React from 'react';

import Link from 'next/link';

const Index = () => (
  <div>
    <Head>
      <title>Index Page</title>
      <meta name="description" content="This is a description of the Index Page" />
    </Head>
    <div>
      <p>Welcome to the Index :)</p>
      <Link href="/csr-page" as="/csr-page">
        <a>Go to CSR Page</a>
      </Link>
    </div>
  </div>
);

export default Index;
