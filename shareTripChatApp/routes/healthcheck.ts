import express from 'express';

const router = express.Router()

router.get('/beat', (req: express.Request, res: express.Response) => {
        res.status(201).json({message: 'boom tss boom tss boom tss'})
    })

module.exports = router
