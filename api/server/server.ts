import './env';
import * as mongoSessionStore from 'connect-mongo';
import * as cors from 'cors';
import * as express from 'express';
import * as session from 'express-session';
import * as mongoose from 'mongoose';

import api from './api';

// import logger from './logs';

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
}

mongoose.connect(process.env.MONGO_URL, options);

const server = express();

server.use(cors({origin: process.env.URL_APP, credentials: true}));

server.use(express.json());

const MongoStore = mongoSessionStore(session);

const sessionOptions = {
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 14*24*60*60
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 14 * 24 * 60 * 60 * 1000,
        secure: false,
    }
};

server.use(session(sessionOptions));

api(server);

server.get('*', (_, res) => {
    res.sendStatus(403);
});

server.listen(process.env.PORT_API, (err) => {
    if (err) {
        throw err;
    }
    console.log(`> Ready at ${process.env.URL_API}`);
})
