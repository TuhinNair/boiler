import * as passwordless from 'passwordless';

import sendEmail from './aws-ses';
import getEmailTemplate from './models/EmailTemplate';
import User from './models/User';
import PasswordlessMongoStore from './passwordless-token-mongostore';

const setupPasswordless = ({ server }) => {
  const mongoStore = new PasswordlessMongoStore();

  passwordless.addDelivery(async (tokenToSend, uidToSend, recipient, callback) => {
    try {
      const template = await getEmailTemplate('login', {
        loginURL: `${
          process.env.URL_API
        }/auth/logged-in?token=${tokenToSend}&uid=${encodeURIComponent(uidToSend)}`,
      });

      console.log(template);

      await sendEmail({
        from: `Tuhin <${process.env.EMAIL_SUPPORT_FROM_ADDRESS}>`,
        to: [recipient],
        subject: template.subject,
        body: template.message,
      });

      callback();
    } catch (err) {
      console.log('Email sending error: ', err);
      callback(err);
    }
  });

  passwordless.init(mongoStore);
  server.use(passwordless.sessionSupport());

  server.use((req, _, next) => {
    if (req.user && typeof req.user === 'string') {
      User.findById(req.user, User.publicFields(), (err, user) => {
        req.user = user;
        next(err);
      });
    } else {
      next();
    }
  });

  server.post(
    '/auth/email-login-link',
    passwordless.requestToken(async (email, _, callback) => {
      console.log('hit auth/email-login-link');
      try {
        const user = await User.findOne({ email }).select('_id').setOptions({ lean: true });
        console.log('found user');

        if (user) {
          callback(null, user._id);
        } else {
          const id = await mongoStore.storeOrUpdateByEmail(email);
          callback(null, id);
        }
      } catch (err) {
        callback(err, null);
      }
    }),
    (_, res) => {
      res.json({ done: 1 });
    },
  );

  server.get(
    '/auth/logged-in',
    passwordless.acceptToken(),
    (req, _, next) => {
      if (req.user && typeof req.user === 'string') {
        User.findById(req.user, User.publicFields(), (err, user) => {
          req.user = user;
          next(err);
        });
      } else {
        next();
      }
    },
    (_, res) => {
      res.redirect(`${process.env.URL_APP}/your-settings`);
    },
  );

  server.get('/logout', passwordless.logout(), (req, res) => {
    req.logout();
    res.redirect(`${process.env.URL_APP}/login`);
  });
};

export { setupPasswordless };
