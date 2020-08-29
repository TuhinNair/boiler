import './env';
import * as express from 'express';

import api from './api';

const server = express();

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
