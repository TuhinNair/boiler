import * as _ from 'lodash';
import * as mongoose from 'mongoose';

const mongoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

interface EmailTemplateDocument extends mongoose.Document {
  name: string;
  subject: string;
  message: string;
}

const EmailTemplate = mongoose.model<EmailTemplateDocument>('EmailTemplate', mongoSchema);

export async function insertTemplates() {
  const templates = [
    {
      name: 'welcome',
      subject: 'Welcome to Node Service',
      message: `Welcome <%= userName %>,
            <p> Thanks for signing up </p>
            <br />
            <p> <a href="https://www.google.com" target="blank">Click here</a> to go to Google. </p>`,
    },
    {
      name: 'login',
      subject: 'Login to Node Service',
      message: `
        <p> Login to your account by clicking this link: <a href="<%= loginURL %>">Login</a>.</p>
      `,
    },
  ];

  for (const t of templates) {
    const et = await EmailTemplate.findOne({ name: t.name });
    const message = t.message.replace(/\n/g, '').replace(/[ ]+/g, ' ').trim();

    if (!et) {
      EmailTemplate.create({ ...t, message });
    } else if (et.subject !== t.subject || et.message !== message) {
      EmailTemplate.updateOne({ _id: et._id }, { $set: { message, subject: t.subject } }).exec();
    }
  }
}

export default async function getEmailTemplate(name: string, params: any) {
  const et = await EmailTemplate.findOne({ name }).setOptions({ lean: true });

  if (!et) {
    throw new Error(`Email template with name:${name} not found in database`);
  }

  return {
    message: _.template(et.message)(params),
    subject: _.template(et.subject)(params),
  };
}
