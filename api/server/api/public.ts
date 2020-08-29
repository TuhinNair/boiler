import * as express from 'express';

import User from '../models/User';

const router = express.Router();

router.post('/get-user-by-slug', async (req, res, next) => {
    try {
        const {slug} = req.body;

        const userDoc = await User.getUserBySlug({slug});

        res.json({userDoc});
    } catch (err) {
        next(err);
    }
});

router.post('/user/update-profile', async (req, res, next) => {
    try {
        const {name, avatarUrl} = req.body;

        const userId = 'someString';

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