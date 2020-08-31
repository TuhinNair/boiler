import * as express from 'express';

import {signedRequestForUpload} from '../aws-s3';

const router = express.Router();

router.post('/aws/get-signed-request-for-upload-to-s3', async (req, res, next) => {
    try {
        const {fileName, fileType, prefix, bucket} = req.body;

        const returnData = await signedRequestForUpload({
            fileName,
            fileType,
            prefix,
            bucket,
        });

        res.json(returnData);
    } catch(err) {
        next(err);
    }
});

export default router;