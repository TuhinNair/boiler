import type { AppProps } from 'next/app';
import CssBaseline from '@material-ui/core/CssBaseline';
import { themeDark, themeLight } from '../lib/theme';
import Head from 'next/head';
import React, { useEffect } from 'react';
import { ThemeProvider } from '@material-ui/core';
import { isMobile } from '../lib/isMobile';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <ThemeProvider theme={true ? themeDark : themeLight}>
        <CssBaseline />
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  let firstGridItem = true;

  if (ctx.pathname.includes('/login')) {
    firstGridItem = false;
  }
  let pageProps = { isMobile: isMobile({ req: ctx.req }), firstGridItem };

  if (Component.getInitialProps) {
    const compProps = await Component.getInitialProps(ctx);
    pageProps = { ...pageProps, ...compProps };
  }

  return { pageProps };
};

export default MyApp;
