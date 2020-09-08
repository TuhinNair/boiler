import React, { Component } from 'react';
import Router from 'next/router';

import * as NProgress from 'nprogress';

import { getUserApiMethod } from './api/public';

Router.events.on('routeChangeStart', () => {
  NProgress.start();
});

Router.events.on('routeChangeComplete', () => {
  NProgress.done();
});

Router.events.on('routeChangeError', () => {
  NProgress.done();
});

type Props = {
  user: { email: string; displayName: string; slug: string; avatarUrl: string };
};

export default function withAuth(Component, { loginRequired = true, logoutRequired = false } = {}) {
  const WithAuth = (props: Props) => {
    const { user } = props;

    if (loginRequired && !logoutRequired && !user) {
      return null;
    }

    if (logoutRequired && user) {
      return null;
    }

    return <Component {...props} />;
  };

  WithAuth.getInitialProps = async (ctx) => {
    const { req, res } = ctx;

    let pageComponentProps = {};

    if (Component.getInitialProps) {
      pageComponentProps = Component.getInitialProps(ctx);
    }

    const headers: any = {};
    if (req.headers && req.headers.cookie) {
      headers.cookie = req.headers.cookie;
    }

    const { user } = await getUserApiMethod({ headers });

    if (loginRequired && !logoutRequired && !user) {
      if (res) {
        res.redirect('/login');
      } else {
        Router.push('/login');
      }
      return;
    }

    let redirectUrl = '/login';
    let asUrl = '/login';

    if (user) {
      redirectUrl = '/your-settings';
      asUrl = '/your-settings';
    }

    if (logoutRequired && user) {
      if (res) {
        res.redirect(`${redirectUrl}`);
      } else {
        Router.push(redirectUrl, asUrl);
      }
    }

    return { ...pageComponentProps, user };
  };

  return WithAuth;
}
