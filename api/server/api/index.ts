import * as express from 'express';

import publicExpressRoutes from './public';
import teamMemberExpressRoutes from './team-member';

function handleError(err, _, res, _) {
    console.log(err.stack);

    res.json({error: err.message || err.toString()});
}

export default function api(server: express.Express) {
    server.use('/api/v1/public', publicExpressRoutes, handleError);
    server.use('/api/v1/team-member', teamMemberExpressRoutes, handleError);
}