import * as mongoose from 'mongoose';
import { generateSlug } from '../utils/slugify';
import * as _ from 'lodash';
import getEmailTemplate from './EmailTemplate';
import sendEmail from '../aws-ses';
import { addToMailchimp } from '../mailchimp';

mongoose.set('useFindAndModify', false);

const mongoSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: String,
  avatarUrl: String,
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  googleToken: {
    accessToken: String,
    refreshToken: String,
  },
  isSignedupViaGoogle: {
    type: Boolean,
    required: true,
    default: false,
  },
});

interface UserModel extends mongoose.Model<UserDocument> {
  getUserBySlug({ slug }: { slug: string }): Promise<UserDocument>;

  updateProfile({
    userId,
    name,
    avatarUrl,
  }: {
    userId: string;
    name: string;
    avatarUrl: string;
  }): Promise<UserDocument[]>;

  publicFields(): string[];

  signInOrSignUpViaGoogle({
    googleId,
    email,
    displayName,
    avatarUrl,
    googleToken,
  }: {
    googleId: string;
    email: string;
    displayName: string;
    avatarUrl: string;
    googleToken: { accessToken?: string; refreshToken?: string };
  }): Promise<UserDocument>;

  signInOrSignUpByPasswordless({
    uid,
    email,
  }: {
    uid: string;
    email: string;
  }): Promise<UserDocument>;
}

class UserClass extends mongoose.Model {
  public static async getUserBySlug({ slug }) {
    return this.findOne({ slug }, 'email displayName avatarUrl', { lean: true });
  }

  public static async updateProfile({ userId, name, avatarUrl }) {
    const user = await this.findById(userId, 'slug displayName');

    const modifier = { displayName: user.displayName, avatarUrl, slug: user.slug };

    if (name !== user.displayName) {
      modifier.displayName = name;
      modifier.slug = await generateSlug(this, name);
    }

    return this.findByIdAndUpdate(userId, { $set: modifier }, { new: true, runValidators: true })
      .select('displayName avatarUrl slug')
      .setOptions({ lean: true });
  }

  public static publicFields(): string[] {
    return ['_id', 'id', 'displayName', 'email', 'avatarUrl', 'slug', 'isSignedupViaGoogle'];
  }

  public static async signInOrSignUpViaGoogle({
    googleId,
    email,
    displayName,
    avatarUrl,
    googleToken,
  }) {
    const user = await this.findOne({ email })
      .select([...this.publicFields(), 'googleId'].join(' '))
      .setOptions({ lean: true });

    if (user) {
      if (_.isEmpty(googleToken) && user.googleId) {
        return user;
      }

      const modifier = { googleId };
      if (googleToken.accessToken) {
        modifier['googleToken.accessToken'] = googleToken.accessToken;
      }

      if (googleToken.refreshToken) {
        modifier['googleToken.refreshToken'] = googleToken.refreshToken;
      }

      await this.updateOne({ email }, { $set: modifier });

      return user;
    }

    const slug = await generateSlug(this, displayName);

    const newUser = await this.create({
      createdAt: new Date(),
      googleId,
      email,
      googleToken,
      displayName,
      avatarUrl,
      slug,
      isSignedupViaGoogle: true,
    });

    const emailTemplate = await getEmailTemplate('welcome', { userName: displayName });

    if (!emailTemplate) {
      throw new Error('Welcome email template not found');
    }

    try {
      await sendEmail({
        from: `Admin from node_service <${process.env.EMAIL_SUPPORT_FROM_ADDRESS}>`,
        to: [email],
        subject: emailTemplate.subject,
        body: emailTemplate.message,
      });
    } catch (err) {
      console.error('Email sending error: ', err);
    }

    try {
      await addToMailchimp({ email, listName: 'signups' });
    } catch (err) {
      console.log('Mailchimp error: ', err);
    }

    return _.pick(newUser, this.publicFields());
  }

  public static async signInOrSignUpByPasswordless({ uid, email }) {
    const user = await this.findOne({ email })
      .select(this.publicFields().join(' '))
      .setOptions({ lean: true });

    if (user) {
      throw new Error('User already exists');
    }

    const slug = await generateSlug(this, email);

    const newUser = await this.create({
      _id: uid,
      createdAt: new Date(),
      email,
      slug,
    });

    const emailTemplate = await getEmailTemplate('welcome', { userName: email });

    if (!emailTemplate) {
      throw new Error('Email  template "welcome" not found in database');
    }

    try {
      await sendEmail({
        from: `Tuhin <${process.env.EMAIL_SUPPORT_FROM_ADDRESS}>`,
        to: [email],
        subject: emailTemplate.subject,
        body: emailTemplate.message,
      });
    } catch (err) {
      console.log('Email sending error: ', err);
    }

    try {
      await addToMailchimp({ email, listName: 'signups' });
    } catch (err) {
      console.log('Mailchimp error: ', err);
    }

    return _.pick(newUser, this.publicFields());
  }
}

mongoSchema.loadClass(UserClass);
const User = mongoose.model<UserDocument, UserModel>('User', mongoSchema);

export interface UserDocument extends mongoose.Document {
  slug: string;
  createdAt: Date;
  email: string;
  displayName: string;
  avatarUrl: string;
  googleId: string;
  googleToken: { accessToken: string; refreshToken: string };
  isSignedupViaGoogle: boolean;
}

export default User;
