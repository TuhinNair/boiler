import Head from 'next/head';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import NProgress from 'nprogress';
import * as React from 'react';
import { useState } from 'react';

import Layout from '../components/layout';

import { getUserBySlugApiMethod, updateProfileApiMethod } from '../lib/api/public';

import {
  getSignedRequestForUploadApiMethod,
  uploadFileUsingSignedPutRequestApiMethod,
} from '../lib/api/team-member';

import notify from '../lib/notify';

type Props = {
  isMobile: boolean;
  user: { email: string; displayName: string; slug: string; avatarUrl: string };
};

type State = {
  newName: string;
  newAvatarUrl: string;
  disabled: boolean;
};

const YourSettings = (props: Props) => {
  const { user } = props;
  const initState: State = {
    newName: user.displayName,
    newAvatarUrl: user.avatarUrl,
    disabled: false,
  };
  const [form, setForm] = useState(initState);

  const handleUpdateForm = ({ target: { value } }, key) => {
    setForm({ ...form, [key]: value });
  };

  const handleUpdateAvatarUrl = (url) => {
    setForm({ ...form, newAvatarUrl: url });
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { newName } = form;

    NProgress.start();
    setForm({ ...form, disabled: true });

    try {
      await updateProfileApiMethod({ name: form.newName, avatarUrl: form.newAvatarUrl });
      notify('You successfully updated your profile');
    } catch (err) {
      notify(err);
    } finally {
      setForm({ ...form, disabled: false });
      NProgress.done();
    }
  };

  const handleUploadFile = async () => {
    const fileElement = document.getElementById('upload-file') as HTMLFormElement;
    const file = fileElement.files[0];

    if (file == null) {
      notify('No file selected for upload');
      return;
    }

    const fileName = file.name;
    const fileType = file.type;

    NProgress.start();
    setForm({ ...form, disabled: true });

    const bucket = process.env.BUCKET_FOR_AVATARS;

    const prefix = 'node-service';

    try {
      const responseFromApiServerForUpload = await getSignedRequestForUploadApiMethod({
        fileName,
        fileType,
        prefix,
        bucket,
      });
      console.log('resonse From Api Server for upload ', responseFromApiServerForUpload);

      await uploadFileUsingSignedPutRequestApiMethod(
        file,
        responseFromApiServerForUpload.signedRequest,
        {
          'Cache-Control': 'max-age=2592000',
        },
      );

      handleUpdateAvatarUrl(responseFromApiServerForUpload.url);
      console.log('form ', form);

      await updateProfileApiMethod({
        name: form.newName,
        avatarUrl: responseFromApiServerForUpload.url,
      });

      notify('You successfully uploaded new avatar');
    } catch (error) {
      notify(error);
    } finally {
      fileElement.value = '';
      setForm({ ...form, disabled: false });
      NProgress.done();
    }
  };

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
        <form onSubmit={onSubmit} autoComplete="off">
          <h4>Your Name</h4>
          <TextField
            autoComplete="off"
            value={form.newName}
            helperText={'Your name as seen by your Team members'}
            onChange={(event) => {
              handleUpdateForm(event, 'newName');
            }}
          />
          <br />
          <br />
          <Button variant="outlined" color="primary" type="submit" disabled={form.disabled}>
            Update Name
          </Button>
        </form>
        <br />
        <h4>Your Avatar</h4>
        <Avatar
          src={form.newAvatarUrl}
          style={{
            display: 'inline-flex',
            verticalAlign: 'middle',
            marginRight: 20,
            width: 60,
            height: 60,
          }}
        />
        <label htmlFor="upload-file">
          <Button variant="outlined" color="primary" component="span" disabled={form.disabled}>
            Update Avatar
          </Button>
        </label>
        <input
          accept="image/*"
          name="upload-file"
          id="upload-file"
          type="file"
          style={{ display: 'none' }}
          onChange={handleUploadFile}
        />
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
