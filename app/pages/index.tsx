import Head from 'next/head';
import Button from '@material-ui/core/Button';
import React from 'react';

import Link from 'next/link';

import Layout from '../components/layout';

import NProgress from 'nprogress';

import notify from '../lib/notify';
import confirm from '../lib/confirm';

import { getUser } from '../lib/api/public';

type Props = { user: { email: string } };

const Index = (props: Props) => {
  return (
    <Layout {...props}>
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
          <Button
            variant="contained"
            onClick={() =>
              confirm({
                title: 'Are you sure?',
                message: 'Explanation',
                onAnswer: async (answer: boolean) => {
                  if (!answer) {
                    return;
                  }

                  NProgress.start();

                  try {
                    notify('You successfully confirmed');
                  } catch (err) {
                    console.log(err);
                    notify(err);
                  } finally {
                    NProgress.done();
                  }
                },
              })
            }
          >
            Confirm and Notify
          </Button>
          <p>Email: {props.user.email}</p>
        </div>
      </div>
    </Layout>
  );
};

Index.getInitialProps = async (ctx) => {
  const { req } = ctx;

  const user = await getUser(req);

  console.log(user);
  return { ...user };
};

export default Index;
