import './env';
import * as express from 'express';

const server = express();

server.use(express.json());

server.get('/api/v1/public/get-user', (_, res) => {
    res.json({user: {email: 'tuhin@tuhin.com'}});
})

server.get('*', (_, res) => {
    res.sendStatus(403);
});

server.listen(process.env.PORT_API, (err) => {
    if (err) {
        throw err;
    }
    console.log(`> Ready at ${process.env.URL_API}`);
})
