import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import React, { memo, useState } from 'react';

import { emailLoginLinkApiMethod } from '../../lib/api/public';
import notify from '../../lib/notify';

import { styleLoginButton } from '../../lib/sharedStyles';

const LoginButton = () => {
  const url = `${process.env.URL_API}/auth/google`;

  const [email, setEmail] = useState('');

  const handleEmailUpdate = ({ target: { value } }) => {
    setEmail(value);
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();

    if (!email) {
      notify('Email is required');
      return;
    }

    try {
      await emailLoginLinkApiMethod({ email });
      setEmail(() => '');
      notify("We've sent you a link to your email");
    } catch (err) {
      notify(err);
    }
  };

  return (
    <>
      <Button variant="contained" style={styleLoginButton} href={url}>
        <img src="https://storage.googleapis.com/async-await-all/G.svg" alt="Log in with Google" />
        &nbsp;Log in with Google
      </Button>
      <p />
      <br />
      <hr style={{ width: '60px' }} />
      <p />
      <br />
      <div>
        <form autoComplete="off" onSubmit={handleEmailSubmit}>
          <TextField
            required
            type="email"
            label="Email address"
            value={email}
            onChange={handleEmailUpdate}
            style={{ width: '300px' }}
          />
          <p />
          <Button variant="contained" color="primary" type="submit">
            Log in with Email
          </Button>
        </form>
        <p />
        <br />
      </div>
    </>
  );
};

export default memo(LoginButton);
