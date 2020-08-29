import './env';
import * as cors from 'cors';
import * as express from 'express';
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
