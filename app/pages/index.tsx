import Head from 'next/head';
import Button from '@material-ui/core/Button';
import React from 'react';

import Link from 'next/link';

import Layout from '../components/layout';

import NProgress from 'nprogress';

import notify from '../lib/notify';
import confirm from '../lib/confirm';

import { getUserApiMethod } from '../lib/api/public';
import withAuth from '../lib/withAuth';

type Props = { user: { email: string; displayName: string } };

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
          <p>Name: {props.user.displayName}</p>
        </div>
      </div>
    </Layout>
  );
};

Index.getInitialProps = async (ctx) => {
  const headers: any = {};

  if (ctx.req.headers && ctx.req.headers.cookie) {
    headers.cookie = ctx.req.headers.cookie;
  }

  const user = await getUserApiMethod({ headers });
  return { ...user };
};

export default withAuth(Index);
