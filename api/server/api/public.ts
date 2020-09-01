import * as express from 'express';

import User from '../models/User';

const router = express.Router();

router.post('/get-user-by-slug', async (req, res, next) => {
    req.session.foo = 'bar';
    try {
        const {slug} = req.body;

        const user = await User.getUserBySlug({slug});

        res.json({user});
    } catch (err) {
        next(err);
    }
});

router.post('/user/update-profile', async (req, res, next) => {
    try {
        const {name, avatarUrl} = req.body;

        const userId = '5f49e84f8de8d8f4c8e9ad5d';
        const updatedUser = await User.updateProfile({
            userId: userId,
            name,
            avatarUrl
        });

        res.json({updatedUser});
    } catch (err) {
        next(err);
    }
});

export default router;