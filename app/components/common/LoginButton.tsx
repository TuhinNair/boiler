import Button from '@material-ui/core/Button';
import React, { memo } from 'react';

import { styleLoginButton } from '../../lib/sharedStyles';

const LoginButton = () => {
  const url = `${process.env.URL_API}/auth/google`;

  return (
    <>
      <Button variant="contained" style={styleLoginButton} href={url}>
        <img src="https://storage.googleapis.com/async-await-all/G.svg" alt="Log in with Google" />
        &nbsp;Log in with Google
      </Button>
      <p />
      <br />
    </>
  );
};

export default memo(LoginButton);
